process.env.NODE_ENV = "test";
process.env.SECRET_KEY = "test-secret-key";
process.env.CLIENT_URL = "http://localhost:5173";

jest.mock("../src/utils/uploadToCloudinary", () =>
  jest.fn(async (file) => {
    if (!file) return null;
    return {
      secure_url: `https://cdn.test/${file.originalname}`,
    };
  })
);

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../src");
const User = require("../src/models/User");
const Company = require("../src/models/Company");
const Job = require("../src/models/Job");
const Application = require("../src/models/Application");

let mongoServer;
let consoleErrorSpy;

const studentUser = {
  fullname: "Student User",
  email: "student@example.com",
  phoneNumber: "9876543210",
  password: "password123",
  role: "student",
};

const recruiterUser = {
  fullname: "Recruiter User",
  email: "recruiter@example.com",
  phoneNumber: "9876543211",
  password: "password123",
  role: "recruiter",
};

const otherRecruiterUser = {
  fullname: "Other Recruiter",
  email: "other@example.com",
  phoneNumber: "9876543212",
  password: "password123",
  role: "recruiter",
};

const register = (agent, user, fileName) => {
  const req = agent.post("/api/v1/user/register");

  Object.entries(user).forEach(([key, value]) => {
    req.field(key, value);
  });

  if (fileName) {
    req.attach("file", Buffer.from("fake-file"), {
      filename: fileName,
      contentType: "image/png",
    });
  }

  return req;
};

const login = (agent, user) =>
  agent.post("/api/v1/user/login").send({
    email: user.email,
    password: user.password,
    role: user.role,
  });

const registerAndLogin = async (user, fileName) => {
  const agent = request.agent(app);
  await register(agent, user, fileName).expect(201);
  await login(agent, user).expect(200);
  return agent;
};

const createCompany = (agent, name = "Acme Corp") =>
  agent.post("/api/v1/company/register").send({ companyName: name });

const createJob = (agent, companyId, overrides = {}) =>
  agent.post("/api/v1/job/create").send({
    title: "Frontend Developer",
    description: "Build React interfaces",
    requirements: "React,JavaScript,CSS",
    salary: 1200000,
    location: "Remote",
    jobType: "Full Time",
    experience: 2,
    position: 3,
    companyId,
    ...overrides,
  });

beforeAll(async () => {
  consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  await Promise.all([
    User.deleteMany({}),
    Company.deleteMany({}),
    Job.deleteMany({}),
    Application.deleteMany({}),
  ]);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  consoleErrorSpy.mockRestore();
});

describe("API health and routing", () => {
  test("returns health response and consistent 404 response", async () => {
    const health = await request(app).get("/").expect(200);
    expect(health.body).toMatchObject({
      success: true,
      message: "Job Portal API is running",
      data: null,
    });

    const missing = await request(app).get("/api/v1/missing").expect(404);
    expect(missing.body).toMatchObject({
      success: false,
      data: null,
    });
  });
});

describe("Authentication and protected access", () => {
  test("registers, hashes password, logs in with httpOnly cookie, and logs out", async () => {
    const agent = request.agent(app);

    const registered = await register(agent, studentUser, "avatar.png").expect(201);
    expect(registered.body.success).toBe(true);
    expect(registered.body.data.email).toBe(studentUser.email);
    expect(registered.body.data.password).toBeUndefined();
    expect(registered.body.data.profile.profilePhoto).toBe("https://cdn.test/avatar.png");

    const dbUser = await User.findOne({ email: studentUser.email }).select("+password");
    expect(dbUser.password).not.toBe(studentUser.password);

    await register(agent, studentUser).expect(400);

    const badLogin = await agent
      .post("/api/v1/user/login")
      .send({ email: studentUser.email, password: "wrong", role: "student" })
      .expect(400);
    expect(badLogin.body.success).toBe(false);

    const roleMismatch = await agent
      .post("/api/v1/user/login")
      .send({ email: studentUser.email, password: studentUser.password, role: "recruiter" })
      .expect(400);
    expect(roleMismatch.body.success).toBe(false);

    const loginResponse = await login(agent, studentUser).expect(200);
    const loginCookie = loginResponse.headers["set-cookie"].join(";");
    expect(loginCookie).toContain("HttpOnly");
    expect(loginCookie).toContain("Max-Age=86400");
    expect(loginCookie).toContain("token=");

    const logout = await agent.get("/api/v1/user/logout").expect(200);
    expect(logout.headers["set-cookie"].join(";")).toContain("Max-Age=0");
  });

  test("blocks protected routes without a token and with an invalid token", async () => {
    const noToken = await request(app).get("/api/v1/company/get").expect(401);
    expect(noToken.body.success).toBe(false);

    const invalidToken = await request(app)
      .get("/api/v1/company/get")
      .set("Cookie", "token=invalid-token")
      .expect(401);
    expect(invalidToken.body.success).toBe(false);
  });
});

describe("Profile APIs", () => {
  test("updates profile without a file, uploads resume, and uploads profile image", async () => {
    const agent = await registerAndLogin(studentUser);

    const plainUpdate = await agent
      .post("/api/v1/user/profile/update")
      .send({
        fullname: "Updated Student",
        bio: "Open to work",
        skills: "React,Node.js,MongoDB",
      })
      .expect(200);

    expect(plainUpdate.body.data.fullname).toBe("Updated Student");
    expect(plainUpdate.body.data.profile.skills).toEqual(["React", "Node.js", "MongoDB"]);

    const resumeUpdate = await agent
      .post("/api/v1/user/profile/update")
      .field("bio", "Resume uploaded")
      .attach("file", Buffer.from("resume"), {
        filename: "resume.pdf",
        contentType: "application/pdf",
      })
      .expect(200);

    expect(resumeUpdate.body.data.profile.resume).toBe("https://cdn.test/resume.pdf");
    expect(resumeUpdate.body.data.profile.resumeOriginalName).toBe("resume.pdf");

    const imageUpdate = await agent
      .post("/api/v1/user/profile/update")
      .attach("file", Buffer.from("avatar"), {
        filename: "new-avatar.png",
        contentType: "image/png",
      })
      .expect(200);

    expect(imageUpdate.body.data.profile.profilePhoto).toBe("https://cdn.test/new-avatar.png");
  });
});

describe("Company APIs", () => {
  test("creates, fetches, and updates recruiter-owned companies", async () => {
    const recruiter = await registerAndLogin(recruiterUser);
    const student = await registerAndLogin(studentUser);

    await student.post("/api/v1/company/register").send({ companyName: "Blocked Co" }).expect(403);

    const created = await createCompany(recruiter).expect(201);
    const companyId = created.body.data._id;
    expect(created.body.data.name).toBe("Acme Corp");

    const aliasCreated = await recruiter
      .post("/api/v1/company/create")
      .send({ companyName: "Alias Co" })
      .expect(201);
    expect(aliasCreated.body.data.name).toBe("Alias Co");

    await createCompany(recruiter).expect(400);

    const list = await recruiter.get("/api/v1/company/get").expect(200);
    expect(list.body.data).toHaveLength(2);

    const fetched = await recruiter.get(`/api/v1/company/get/${companyId}`).expect(200);
    expect(fetched.body.data._id).toBe(companyId);

    await recruiter.get("/api/v1/company/get/not-an-id").expect(400);

    const updated = await recruiter
      .put(`/api/v1/company/update/${companyId}`)
      .field("description", "Hiring engineers")
      .field("location", "Bengaluru")
      .attach("file", Buffer.from("logo"), {
        filename: "logo.png",
        contentType: "image/png",
      })
      .expect(200);

    expect(updated.body.data.logo).toBe("https://cdn.test/logo.png");
    expect(updated.body.data.location).toBe("Bengaluru");
  });

  test("prevents recruiters from updating companies they do not own", async () => {
    const recruiter = await registerAndLogin(recruiterUser);
    const otherRecruiter = await registerAndLogin(otherRecruiterUser);
    const created = await createCompany(recruiter, "Owner Co").expect(201);

    await otherRecruiter
      .put(`/api/v1/company/update/${created.body.data._id}`)
      .send({ location: "Nope" })
      .expect(403);
  });
});

describe("Job APIs", () => {
  test("creates and fetches jobs with recruiter ownership checks", async () => {
    const recruiter = await registerAndLogin(recruiterUser);
    const otherRecruiter = await registerAndLogin(otherRecruiterUser);
    const student = await registerAndLogin(studentUser);
    const company = await createCompany(recruiter, "Job Co").expect(201);

    await student.post("/api/v1/job/create").send({}).expect(403);
    await createJob(recruiter, "not-an-id").expect(400);
    await createJob(otherRecruiter, company.body.data._id).expect(403);
    await createJob(recruiter, company.body.data._id, { title: "" }).expect(400);

    const created = await createJob(recruiter, company.body.data._id).expect(201);
    const jobId = created.body.data._id;
    expect(created.body.data.company._id).toBe(company.body.data._id);

    const aliasCreated = await recruiter
      .post("/api/v1/job/post")
      .send({
        title: "Backend Developer",
        description: "Build APIs",
        requirements: "Node.js,Express,MongoDB",
        salary: 1400000,
        location: "Remote",
        jobType: "Full Time",
        experience: 3,
        position: 2,
        companyId: company.body.data._id,
      })
      .expect(201);
    expect(aliasCreated.body.data.title).toBe("Backend Developer");

    const allJobs = await student.get("/api/v1/job/get?keyword=frontend").expect(200);
    expect(allJobs.body.data).toHaveLength(1);

    const single = await student.get(`/api/v1/job/get/${jobId}`).expect(200);
    expect(single.body.data._id).toBe(jobId);

    await student.get("/api/v1/job/get/not-an-id").expect(400);

    const updated = await recruiter
      .put(`/api/v1/job/update/${jobId}`)
      .send({ title: "Senior Frontend Developer", salary: 1500000 })
      .expect(200);
    expect(updated.body.data.title).toBe("Senior Frontend Developer");
    expect(updated.body.data.salary).toBe(1500000);

    await otherRecruiter.patch(`/api/v1/job/update/${jobId}`).send({ title: "Nope" }).expect(403);
    await recruiter.put("/api/v1/job/update/not-an-id").send({ title: "Nope" }).expect(400);

    const recruiterJobs = await recruiter.get("/api/v1/job/getadminjobs").expect(200);
    expect(recruiterJobs.body.data).toHaveLength(2);

    const adminAlias = await recruiter.get("/api/v1/job/admin").expect(200);
    expect(adminAlias.body.data).toHaveLength(2);
  });
});

describe("Application APIs", () => {
  test("applies, prevents duplicates, fetches applicants, and updates status", async () => {
    const recruiter = await registerAndLogin(recruiterUser);
    const otherRecruiter = await registerAndLogin(otherRecruiterUser);
    const student = await registerAndLogin(studentUser);
    const company = await createCompany(recruiter, "Apply Co").expect(201);
    const job = await createJob(recruiter, company.body.data._id).expect(201);
    const secondJob = await createJob(recruiter, company.body.data._id, {
      title: "Second Frontend Developer",
    }).expect(201);
    const jobId = job.body.data._id;

    await recruiter.post(`/api/v1/application/apply/${jobId}`).expect(403);
    await student.post("/api/v1/application/apply/not-an-id").expect(400);

    const applied = await student.post(`/api/v1/application/apply/${jobId}`).expect(201);
    const applicationId = applied.body.data._id;
    const appliedWithGetAlias = await student.get(`/api/v1/application/apply/${secondJob.body.data._id}`).expect(201);

    await student.post(`/api/v1/application/apply/${jobId}`).expect(400);

    const appliedJobs = await student.get("/api/v1/application/get").expect(200);
    expect(appliedJobs.body.data).toHaveLength(2);
    expect(appliedJobs.body.data[0].job.company.name).toBe("Apply Co");

    const applicants = await recruiter.get(`/api/v1/application/${jobId}/applicants`).expect(200);
    expect(applicants.body.data.applications).toHaveLength(1);

    await otherRecruiter.get(`/api/v1/application/${jobId}/applicants`).expect(403);
    await recruiter.get("/api/v1/application/not-an-id/applicants").expect(400);

    await recruiter
      .post(`/api/v1/application/status/${applicationId}/update`)
      .send({ status: "maybe" })
      .expect(400);

    await otherRecruiter
      .post(`/api/v1/application/status/${applicationId}/update`)
      .send({ status: "accepted" })
      .expect(403);

    const updated = await recruiter
      .post(`/api/v1/application/status/${applicationId}/update`)
      .send({ status: "accepted" })
      .expect(200);

    expect(updated.body.data.status).toBe("accepted");

    const patchUpdated = await recruiter
      .patch(`/api/v1/application/status/${appliedWithGetAlias.body.data._id}`)
      .send({ status: "rejected" })
      .expect(200);

    expect(patchUpdated.body.data.status).toBe("rejected");
    await recruiter.post("/api/v1/application/status/not-an-id/update").send({ status: "accepted" }).expect(400);
  });
});
