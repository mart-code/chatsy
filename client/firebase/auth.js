import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";

const auth = getAuth();

// ===== EMAIL/PASSWORD AUTHENTICATION =====

/**
 * Login user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} Response from backend
 */
export const loginUser = async (email, password) => {
  try {
    // 1. Sign in user with Firebase
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    // 2. Get the ID Token (JWT)
    const idToken = await userCredential.user.getIdToken();

    // 3. Send token to backend
    const response = await fetch("http://localhost:4000/api/login", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Login failed:", error.message);
    throw error;
  }
};

/**
 * Signup user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} Response from backend
 */
export const signupUser = async (email, password) => {
  try {
    // 1. Create user in Firebase
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    // 2. Get the ID Token (JWT)
    const idToken = await userCredential.user.getIdToken();

    // 3. Send token to backend
    const response = await fetch("http://localhost:4000/api/signup", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Signup failed:", error.message);
    throw error;
  }
};

/**
 * Logout user
 * @returns {Promise<void>}
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout failed:", error.message);
    throw error;
  }
};

/**
 * Send password reset email
 * @param {string} email - User's email
 * @returns {Promise<void>}
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Password reset failed:", error.message);
    throw error;
  }
};

// ===== GOOGLE AUTHENTICATION =====

/**
 * Setup Google Provider with required scopes
 */
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("profile");
googleProvider.addScope("email");

/**
 * Sign in with Google (Popup)
 * @returns {Promise<Object>} User and Google token info
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    // Get the user
    const user = result.user;

    // Get Google Access Token
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;

    // Send to backend
    const idToken = await user.getIdToken();
    const response = await fetch("http://localhost:4000/api/google-login", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`);
    }

    return {
      user,
      googleToken: token,
      backendResponse: await response.json(),
    };
  } catch (error) {
    console.error("Google sign-in failed:", error.message);
    throw error;
  }
};

// ===== AUTH STATE MANAGEMENT =====

/**
 * Get current authenticated user
 * @returns {Object|null} Current user object or null
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Listen to auth state changes
 * @param {Function} callback - Function to call when auth state changes
 * @returns {Function} Unsubscribe function
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

/**
 * Get auth instance
 * @returns {Object} Firebase auth instance
 */
export const getAuthInstance = () => {
  return auth;
};
