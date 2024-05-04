import { Request, Response } from "express";


export const homePage = async (req: Request, res: Response ): Promise < void >  => {
    try {
        res.send("home page")
    } catch (error: any) {
        throw new Error(error?.message);
        
    }
}