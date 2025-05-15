import { describe, expect, jest } from "@jest/globals";
import { auth } from "../../config/config.js";
jest.unstable_mockModule("bcrypt", () => ({
  default: {
    hash: jest.fn(),
    genSalt: jest.fn(),
    compare: jest.fn(),
  },
}));
jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    verify: jest.fn(),
    sign: jest.fn(),
  },
}));

const jwt = await import("jsonwebtoken");
const bcrypt = await import("bcrypt");
const { createToken, verifyToken } = await import(
  "../../services/authService.js"
);
describe("Auth Service Tests", () => {
  const mockUserId = 2;
  const mockToken = "fake_token2";

  const mockPayload = {
    userId: mockUserId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  };

  describe("createToken", () => {
    it("should create a token with userId payload", () => {
      jwt.default.sign.mockReturnValue(mockToken);

      const token = createToken(mockUserId);

      expect(token).toBe(mockToken);
      expect(jwt.default.sign).toHaveBeenCalledWith(
        { userId: mockUserId },
        auth.jwtSecret,
        { expiresIn: auth.tokenExpiry }
      );
    });
  });

  describe("verifyToken", () => {
    it("should verify the token and return payload", () => {
      jwt.default.verify.mockReturnValue(mockPayload);

      const result = verifyToken(mockToken);

      expect(jwt.default.verify).toHaveBeenCalledWith(
        mockToken,
        auth.jwtSecret
      );
      expect(result).toEqual({
        userId: mockUserId,
        iat: expect.any(Number),
        exp: expect.any(Number),
      });
    });
  });
  describe("verify password", () => {
    it("should verify the password and return payload", () => {
      jwt.default.verify.mockReturnValue(mockPayload);

      const result = verifyToken(mockToken);

      expect(jwt.default.verify).toHaveBeenCalledWith(
        mockToken,
        auth.jwtSecret
      );
      expect(result).toEqual({
        userId: mockUserId,
        iat: expect.any(Number),
        exp: expect.any(Number),
      });
    });
  });
});
