import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define user roles and their permissions
export enum UserRole {
  USER = "user",
  MODERATOR = "moderator", 
  ADMIN = "admin"
}

export interface UserPermissions {
  canViewPages: boolean;
  canManageContent: boolean;
  canManageUsers: boolean;
  canAccessCRM: boolean;
  canAccessAdmin: boolean;
  canViewAnalytics: boolean;
  canManageSettings: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: UserRole;
  permissions: UserPermissions;
  lastLogin?: Date;
  ipAddress?: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: keyof UserPermissions) => boolean;
  hasRole: (role: UserRole) => boolean;
  isAuthenticated: boolean;
}

// Define permissions for each role
const ROLE_PERMISSIONS: Record<UserRole, UserPermissions> = {
  [UserRole.USER]: {
    canViewPages: true,
    canManageContent: false,
    canManageUsers: false,
    canAccessCRM: false,
    canAccessAdmin: false,
    canViewAnalytics: false,
    canManageSettings: false,
  },
  [UserRole.MODERATOR]: {
    canViewPages: true,
    canManageContent: true,
    canManageUsers: false,
    canAccessCRM: true,
    canAccessAdmin: false,
    canViewAnalytics: true,
    canManageSettings: false,
  },
  [UserRole.ADMIN]: {
    canViewPages: true,
    canManageContent: true,
    canManageUsers: true,
    canAccessCRM: true,
    canAccessAdmin: true,
    canViewAnalytics: true,
    canManageSettings: true,
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in on app start
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing saved user data:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate different user roles
      let userData: User;
      
      if (email === "admin@skyship.com" && password === "admin123") {
        userData = {
          id: "1",
          email: "admin@skyship.com",
          name: "Administrator",
          firstName: "Admin",
          lastName: "User",
          role: UserRole.ADMIN,
          permissions: ROLE_PERMISSIONS[UserRole.ADMIN],
          lastLogin: new Date(),
          ipAddress: "192.168.1.1", // In real app, get from request
        };
      } else if (email === "moderator@skyship.com" && password === "mod123") {
        userData = {
          id: "2",
          email: "moderator@skyship.com",
          name: "Content Moderator",
          firstName: "Content",
          lastName: "Moderator",
          role: UserRole.MODERATOR,
          permissions: ROLE_PERMISSIONS[UserRole.MODERATOR],
          lastLogin: new Date(),
          ipAddress: "192.168.1.2",
        };
      } else if (email === "user@skyship.com" && password === "user123") {
        userData = {
          id: "3",
          email: "user@skyship.com",
          name: "Regular User",
          firstName: "Regular",
          lastName: "User",
          role: UserRole.USER,
          permissions: ROLE_PERMISSIONS[UserRole.USER],
          lastLogin: new Date(),
          ipAddress: "192.168.1.3",
        };
      } else {
        // Check registered users from localStorage
        const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
        console.log("Checking registered users:", registeredUsers);
        const registeredUser = registeredUsers.find((u: any) => u.email === email);
        console.log("Found registered user:", registeredUser);
        
        if (registeredUser) {
          // In a real app, you would hash and compare passwords
          // For demo purposes, we'll use a simple check
          if (registeredUser.password === password) {
            userData = {
              id: registeredUser.id,
              email: registeredUser.email,
              name: registeredUser.name,
              firstName: registeredUser.firstName,
              lastName: registeredUser.lastName,
              phone: registeredUser.phone,
              role: UserRole.USER,
              permissions: ROLE_PERMISSIONS[UserRole.USER],
              lastLogin: new Date(),
              ipAddress: "192.168.1.100", // In real app, get from request
            };
          } else {
            throw new Error("Invalid credentials");
          }
        } else {
          throw new Error("Invalid credentials");
        }
      }

      // Log login attempt for security
      console.log(`Login attempt: ${email} from IP: ${userData.ipAddress} at ${new Date().toISOString()}`);
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userData));
      
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      // In a real app, this would be an API call to create a new user
      // For demo purposes, we'll simulate user creation
      
      // Validate that only users can be created (not admins or moderators)
      if (data.role !== UserRole.USER) {
        throw new Error("Only user accounts can be created through registration");
      }

      // Check if email already exists (in real app, check database)
      const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      if (existingUsers.find((u: any) => u.email === data.email)) {
        throw new Error("Email already exists");
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email: data.email,
        name: `${data.firstName} ${data.lastName}`,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        password: data.password, // Store password for demo purposes (in production, this should be hashed)
        role: UserRole.USER,
        permissions: ROLE_PERMISSIONS[UserRole.USER],
        createdAt: new Date(),
      };

      // Store in localStorage (in real app, save to database)
      existingUsers.push(newUser);
      localStorage.setItem("registeredUsers", JSON.stringify(existingUsers));
      console.log("User registered successfully:", newUser);
      console.log("All registered users:", existingUsers);

      console.log(`New user registered: ${data.email} at ${new Date().toISOString()}`);
      
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  };

  const logout = () => {
    // Log logout for security
    if (user) {
      console.log(`Logout: ${user.email} from IP: ${user.ipAddress} at ${new Date().toISOString()}`);
    }
    
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  const hasPermission = (permission: keyof UserPermissions): boolean => {
    return user?.permissions[permission] || false;
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role || false;
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    hasPermission,
    hasRole,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
