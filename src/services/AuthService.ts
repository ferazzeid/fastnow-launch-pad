import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';

export interface User {
  id: string;
  username: string;
  role: string;
  dateAdded: string;
  failedAttempts?: number;
  lockedUntil?: string;
}

export interface AuthSession {
  userId: string;
  username: string;
  role: string;
  expiresAt: string;
  sessionToken: string;
}

export class AuthService {
  private static readonly SALT_ROUNDS = 12;
  private static readonly SECRET_KEY = 'fastingApp_secret_key'; // In production, use env variable
  private static readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private static readonly MAX_FAILED_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  // Encrypt sensitive data before storing in localStorage
  private static encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, this.SECRET_KEY).toString();
  }

  private static decrypt(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // Generate secure session token
  private static generateSessionToken(): string {
    return CryptoJS.lib.WordArray.random(32).toString();
  }

  // Hash password with bcrypt
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  // Verify password
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Create secure session
  static createSession(user: User): AuthSession {
    const session: AuthSession = {
      userId: user.id,
      username: user.username,
      role: user.role,
      expiresAt: new Date(Date.now() + this.SESSION_DURATION).toISOString(),
      sessionToken: this.generateSessionToken()
    };

    // Store encrypted session
    const encryptedSession = this.encrypt(JSON.stringify(session));
    localStorage.setItem('fastingApp_session', encryptedSession);
    
    return session;
  }

  // Get current session
  static getCurrentSession(): AuthSession | null {
    try {
      const encryptedSession = localStorage.getItem('fastingApp_session');
      if (!encryptedSession) return null;

      const sessionData = this.decrypt(encryptedSession);
      const session: AuthSession = JSON.parse(sessionData);

      // Check if session is expired
      if (new Date(session.expiresAt) < new Date()) {
        this.clearSession();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Error retrieving session:', error);
      this.clearSession();
      return null;
    }
  }

  // Clear session
  static clearSession(): void {
    localStorage.removeItem('fastingApp_session');
    localStorage.removeItem('fastingApp_auth');
    localStorage.removeItem('fastingApp_currentUser');
  }

  // Get all users
  static async getUsers(): Promise<User[]> {
    try {
      const encryptedUsers = localStorage.getItem('fastingApp_users_encrypted');
      if (!encryptedUsers) {
        return await this.createDefaultAdmin();
      }

      const usersData = this.decrypt(encryptedUsers);
      return JSON.parse(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      return await this.createDefaultAdmin();
    }
  }

  // Save users with encryption
  static saveUsers(users: User[]): void {
    const encryptedUsers = this.encrypt(JSON.stringify(users));
    localStorage.setItem('fastingApp_users_encrypted', encryptedUsers);
  }

  // Create default admin user with secure password
  private static async createDefaultAdmin(): Promise<User[]> {
    const defaultAdmin: User = {
      id: '1',
      username: 'admin',
      role: 'admin',
      dateAdded: new Date().toISOString(),
      failedAttempts: 0
    };

    const users = [defaultAdmin];
    this.saveUsers(users);
    
    // Create secure default password synchronously
    const hashedPassword = await this.hashPassword('admin123!');
    const encryptedPassword = this.encrypt(hashedPassword);
    localStorage.setItem('fastingApp_password_admin', encryptedPassword);

    return users;
  }

  // Authenticate user with rate limiting
  static async authenticate(username: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    if (!username || !password) {
      return { success: false, error: 'Username and password are required' };
    }

    const users = await this.getUsers();
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Check if user is locked out
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      return { success: false, error: 'Account is temporarily locked. Please try again later.' };
    }

    // Get stored password
    const encryptedPassword = localStorage.getItem(`fastingApp_password_${username.toLowerCase()}`);
    if (!encryptedPassword) {
      return { success: false, error: 'Invalid credentials' };
    }

    try {
      const hashedPassword = this.decrypt(encryptedPassword);
      const isValidPassword = await this.verifyPassword(password, hashedPassword);

      if (isValidPassword) {
        // Reset failed attempts on successful login
        user.failedAttempts = 0;
        user.lockedUntil = undefined;
        this.saveUsers(users);

        this.createSession(user);
        return { success: true, user };
      } else {
        // Increment failed attempts
        user.failedAttempts = (user.failedAttempts || 0) + 1;
        
        if (user.failedAttempts >= this.MAX_FAILED_ATTEMPTS) {
          user.lockedUntil = new Date(Date.now() + this.LOCKOUT_DURATION).toISOString();
        }
        
        this.saveUsers(users);
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Authentication error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }

  // Add new user with secure password
  static async addUser(username: string, password: string, role: string): Promise<{ success: boolean; error?: string }> {
    if (!username || !password || !role) {
      return { success: false, error: 'All fields are required' };
    }

    // Validate password strength
    if (password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long' };
    }

    const users = await this.getUsers();
    
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, error: 'Username already exists' };
    }

    try {
      const hashedPassword = await this.hashPassword(password);
      const encryptedPassword = this.encrypt(hashedPassword);

      const newUser: User = {
        id: Date.now().toString(),
        username: username,
        role: role,
        dateAdded: new Date().toISOString(),
        failedAttempts: 0
      };

      users.push(newUser);
      this.saveUsers(users);
      localStorage.setItem(`fastingApp_password_${username.toLowerCase()}`, encryptedPassword);

      return { success: true };
    } catch (error) {
      console.error('Error adding user:', error);
      return { success: false, error: 'Failed to create user' };
    }
  }

  // Delete user securely
  static async deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
    const users = await this.getUsers();
    const user = users.find(u => u.id === userId);

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (user.username.toLowerCase() === 'admin') {
      return { success: false, error: 'Cannot delete admin user' };
    }

    const updatedUsers = users.filter(u => u.id !== userId);
    this.saveUsers(updatedUsers);
    localStorage.removeItem(`fastingApp_password_${user.username.toLowerCase()}`);

    return { success: true };
  }

  // Input sanitization
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  // Check if user is authenticated and has required role
  static hasPermission(requiredRole: string): boolean {
    const session = this.getCurrentSession();
    if (!session) return false;

    const roleHierarchy = { admin: 3, editor: 2, viewer: 1 };
    const userRoleLevel = roleHierarchy[session.role as keyof typeof roleHierarchy] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

    return userRoleLevel >= requiredRoleLevel;
  }
}