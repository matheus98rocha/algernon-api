const data = {
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
};
console.log(process.env.DATABASE_HOST);
console.log(data);
export default () => data;
