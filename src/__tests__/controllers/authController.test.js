import { describe, expect, it, jest } from "@jest/globals";
jest.unstable_mockModule("../../database/conn.js", () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));
jest.unstable_mockModule("../../services/authService.js", () => ({
  verifyPsw: jest.fn(),
  createToken: jest.fn(),
  hashPsw: jest.fn(),
  verifyToken: jest.fn(),
}));

const authController = await import("../../controllers/authController.js");
const { User } = await import("../../database/conn.js");
const { verifyPsw, hashPsw, createToken } = await import(
  "../../services/authService.js"
);

const mockRequest = {
  body: {
    nickname: "teste",
    firstName: "Teste",
    lastName: "da Silva",
    email: "teste@gmail.com",
    birthdate: "2006-03-13",
    gender: "M",
    password: "Seguro",
  },
};
const mockResponse = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  cookie: jest.fn().mockReturnThis(),
});
const mockUser = {
  id: 1,
  nickname: "testuser",
  password: "hashedpassword",
};

describe("Auth Controller Test - Login handler", () => {
  it("should return token with valid credentials", async () => {
    User.findOne.mockResolvedValue(mockUser);
    verifyPsw.mockResolvedValue(true);
    createToken.mockReturnValue("fake_token");
    const req = mockRequest;
    const res = mockResponse();

    await authController.loginHandler(req, res);

    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: "teste@gmail.com" },
      attributes: expect.any(Array),
    });
    expect(verifyPsw).toHaveBeenCalledWith("Seguro", "hashedpassword");
    expect(res.cookie).toHaveBeenCalledWith(
      "auth",
      "fake_token",
      expect.objectContaining({
        maxAge: 1 * 60 * 60 * 1000,
        httpOnly: true,
      })
    );
    expect(res.json).toHaveBeenCalledWith({ token: "fake_token" });
    expect(res.status).toHaveBeenCalledWith(200);
  });
  it("should return Error with wrong password", async () => {
    User.findOne.mockResolvedValue(mockUser);
    verifyPsw.mockResolvedValue(false);
    const req = mockRequest;
    const res = mockResponse();

    await authController.loginHandler(req, res);
    expect(res.json).toHaveBeenCalledWith({ error: "Senha invalida" });
    expect(res.status).toHaveBeenCalledWith(401);
  });
  it("should return Error with wrong email", async () => {
    User.findOne.mockResolvedValue(null);
    verifyPsw.mockResolvedValue(true);
    const req = mockRequest;
    const res = mockResponse();

    await authController.loginHandler(req, res);
    expect(res.json).toHaveBeenCalledWith({ error: "Email invalido" });
    expect(res.status).toHaveBeenCalledWith(401);
  });
  it("should return erro with cookie auth in request", async () => {
    const expectedError = "Usuario ja logado";
    const req = {
      ...mockRequest,
      cookies: { auth: "alredyLoged" },
    };
    const res = mockResponse();

    await authController.loginHandler(req, res);
    expect(res.json).toHaveBeenCalledWith({ error: expectedError });
  });
});
describe("Auth Controller Test - Register handler", () => {
  it("should return sucess with valid request", async () => {
    User.create.mockResolvedValue(mockRequest.body);
    hashPsw.mockResolvedValue(mockUser.password);
    const req = mockRequest;
    const res = mockResponse();
    await authController.registerHandler(req, res);
    const expectedUser = {
      ...mockRequest.body,
      password: mockUser.password,
      birthdate: new Date(mockRequest.body.birthdate),
    };
    expect(User.create).toHaveBeenCalledWith(expectedUser);
    expect(hashPsw).toHaveBeenCalledWith(req.body.password);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: "Usuario cadastrado" });
  });
  it("should return error with invalid request", async () => {
    const expectedError = "Email não fornecido";
    User.create.mockImplementation(() => {
      throw expectedError;
    });
    hashPsw.mockResolvedValue(mockUser.password);
    const req = { ...mockRequest, email: null };
    const res = mockResponse();

    await authController.registerHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: expectedError });
  });
});
