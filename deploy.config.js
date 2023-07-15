module.exports = {
  apps: [
    {
      name: "JCWDOL-09-02", // Format JCWD-{batchcode}-{groupnumber}
      script: "./projects/server/src/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 8902,
      },
      time: true,
    },
  ],
};
