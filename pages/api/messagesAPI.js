import { PrismaClient } from '@prisma/client'

export default async function handler( req, res ) {
    const prisma = new PrismaClient()
    const data = JSON.parse(req.body)
    
    const response = await prisma.messages.create({ data })

    res.json(response)
}