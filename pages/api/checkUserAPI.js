import { PrismaClient } from '@prisma/client'

export default async function handler( req, res ) {
    const prisma = new PrismaClient()
    const data = JSON.parse(req.body)
    const userExists = await prisma.users.findUnique({
        where: {
            slug: data
        }
    })

    let userMessages = await prisma.messages.findMany()

    userMessages = userMessages.filter(item => {
        return item.receiver === userExists.userName
    })

    userMessages.push(userExists.userName)

    console.log(userMessages)

    res.status(200).json(userMessages)
}