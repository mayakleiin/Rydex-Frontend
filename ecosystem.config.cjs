module.exports = {
  apps: [
    {
      name: "rydex-frontend",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        NEXT_PUBLIC_API_URL: "https://node22.cs.colman.ac.il/api",
      },
    },
  ],
};
