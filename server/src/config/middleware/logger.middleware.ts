/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { logger } from "../logger.config";

export async function preRequestLogger(req: Request, res: Response, next: any) {
  const body = { ...req.body };

  const data = {
    route: (req as any).client.parser.incoming.originalUrl,
    headers: req.headers,
    body: body,
    params: req.params,
    query: req.query,
  };

  logger.info(`Request -> ${JSON.stringify(data)}`);
  next();
}

export async function postRequestLogger(req: Request, res: Response) {
  const body = { ...req.body };

  const data = {
    route: (req as any).client.originalUrl,
    headers: req.headers,
    body: body,
    params: req.params,
    query: req.query,
    response: (res as any).data,
  };

  logger.info(`Response -> ${JSON.stringify(data)}`);
}
