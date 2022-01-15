import { PrismaClient } from '@prisma/client'

export default async function handler( req, res ){
    const prisma = new PrismaClient()
    const data = JSON.parse(req.body)

    const userExists = await prisma.users.findUnique({where: {userName: data.userName}})

    if(Object.keys(data).length === 1) {
        if(userExists) {
            res.status(200).json({bool: true})
        }

        else{
            res.status(200).json({bool: false})
        }
    }
    
    else if(Object.keys(data).length === 2) {
        if(userExists) {
            if(data.password === userExists.password) {
                res.status(200).json({
                    bool: true,
                    slug: userExists.slug
                })
            }

            else {
                res.status(200).json({
                    bool: false,
                    slug: "",
                    error: true
                })
            }
        }

        else{
            res.status(200).json({
                bool: false,
                slug: ""
            })
        }
    }

    else {
        if(!userExists) {
            data.phoneNumber = parseInt(data.phoneNumber)
            data.dateOfBirth = data.dateOfBirth.replaceAll('-', '/')

            const response = await prisma.users.create({ data })

            res.json(response)
        }

        else{
            res.status(200).json({
                error: true
            })
        }
    }
}