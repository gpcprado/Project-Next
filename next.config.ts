import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // --- FIX FOR TURBOPACK MULTIPLE LOCKFILES WARNING ---
  turbopack: {
    // This tells Next.js the absolute root directory of your project.
    // Assuming your Next.js project lives in 'C:\Users\counc\OneDrive\Desktop\frontend_prado\my-project\'
    // and the correct root is one or two directories up from where the config runs.
    //
    // **Please adjust the path.join() arguments if this path is incorrect for your setup.**
    // A safe guess often points to the project's parent folder:
    root: path.join(process.cwd(), '/..'), 
  },
  
  // Existing configuration options can go here
  /* config options here */
  // reactCompiler: true,
};

export default nextConfig;
