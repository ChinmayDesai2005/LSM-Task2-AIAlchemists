import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import express from "express"
import cors from "cors"
import { Client } from 'cassandra-driver';

dotenv.config({
    path: '../env'
})

async function run() {
  const client = new Client({
    cloud: {
    secureConnectBundle: "./secure-connect-levelsupermind.zip",
    },
    credentials: {
    username: "&lt;&lt;CLIENT ID&gt;&gt;",
    password: "&lt;&lt;CLIENT SECRET&gt;&gt;",
    },
  });

  await client.connect();

  // Execute a query
  const rs = await client.execute("SELECT * FROM system.local");
  console.log(`Your cluster returned ${rs.rowLength} row(s)`);

  await client.shutdown();
}

run();

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// app.use(express.json({limit: '16kb'}))

app.use(express.json({limit: "200mb"}))

app.use(express.urlencoded({extended: true,limit: '100mb'}));

app.use(express.text({limit: "200mb"}))

app.use(express.static('public'));

app.use(cookieParser());

app.listen(process.env.PORT || 8000, ()=>{
    console.log(`Server connected at port ${process.env.PORT}`)
})