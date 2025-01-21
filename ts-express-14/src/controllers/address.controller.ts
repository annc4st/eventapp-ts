import { Request, Response } from "express";
import prisma from "../../prisma/client";
import { validateAddress } from "../middlewares/validators"

export const createAddress = async (req: Request, res: Response) => {
  try {
    const { firstLine, city, postcode } = req.body;
    if (!firstLine || !city || !postcode) {
        return res.status(400).json({ error: "All fields are required" });
      }
      
    const newAddress = await prisma.address.create({
      data: {
        firstLine,
        city,
        postcode,
      },
    });

    res.status(201).json(newAddress);
  } catch (err) {
    console.error("Error creating address:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAddress = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // Convert id to a number
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return res.status(400).json({ error: "Invalid address ID format" });
    }

    const addressExists = await prisma.address.findUnique({
      where: { id: numericId },
    });
    if (!addressExists) {
      return res.status(401).json({ error: "Invalid address id" });
    }
    res.status(200).json(addressExists);
  } catch (err) {
    console.error("Error retrieving address:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllAddresses = async (req: Request, res: Response) => {
  try {
    const addresses = await prisma.address.findMany();
    res.status(200).json(addresses);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
  }
};
