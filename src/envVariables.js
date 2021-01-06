const envVariables = {
  // DB configurations  
  DB_USER: process.env.DB_USER || "postgres",
  DB_PASSWORD: process.env.DB_PASSWORD || "RMS@123",
  DB_HOST: process.env.DB_HOST || "10.31.13.205",
  DB_NAME: process.env.DB_NAME || "Citation", 
  DB_SSL: process.env.DB_SSL || false, 
  DB_PORT: process.env.DB_PORT || 5432,
  DB_MAX_POOL_SIZE: process.env.DB_MAX_POOL_SIZE || "5",

  // document server configuration
  dmsUsername: process.env.dmsUsername || "admin",
  dmsUrl: process.env.dmsUrl || "http://10.31.13.205:8080",
  dmsPassword: process.env.dmsPassword || "RMS@123",
  
  //server configurations
  SERVER_PORT: process.env.SERVER_PORT || "8086",
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || "abcdefgh",
  ENCRYPTION_IV: process.env.ENCRYPTION_IV || "ijklmnop",

};
export default envVariables;
