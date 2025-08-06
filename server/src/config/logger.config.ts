/* eslint-disable @typescript-eslint/no-explicit-any */
import * as winston from "winston";

// defines log format
const logFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.errors({ stack: true }),
  winston.format.timestamp(),
  winston.format.printf((info: any) => {
    // Convert the main message to a string if needed
    let message =
      typeof info.message === "object"
        ? JSON.stringify(info.message, null, 2)
        : info.message;

    // Check for extra parameters passed in (stored in splat)
    const splat = info[Symbol.for("splat")];
    if (splat && splat.length > 0) {
      // Map each additional parameter to a string
      const metaString = splat
        .map((item: any) => {
          return typeof item === "object"
            ? JSON.stringify(item, null, 2)
            : item;
        })
        .join(" ");
      message = `${message} ${metaString}`;
    }

    return `${info.timestamp} : ${message}`;
  }),
);

// creates new file name
const createFileName = () => {
  const date = new Date();
  const newFileName =
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    date.getDate().toString().padStart(2, "0") +
    "-" +
    date.getTime() +
    ".log";
  return newFileName;
};

export let logger: any;

// initialized winston logger
export const initializeLogger = () => {
  logger = winston
    .createLogger({
      format: logFormat,
      transports: [
        new winston.transports.File({
          maxsize: 10000000, // size in bytes
          maxFiles: 14, // maximum days to keep file
          zippedArchive: false,
          filename: `${process.env.API_LOG_FILE}${createFileName()}`,
          level: "info",
        }),
      ],
    })
    .add(
      new winston.transports.Console({
        format: logFormat,
      }),
    );
};
