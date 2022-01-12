import { useState } from 'react'
import Head from 'next/head'


export default function SendMessage({ user }) {
    const [messageContent, setMessageContent] = useState("")
    const [letLoose, setLetLoose] = useState(false)

    async function userDoesExist() {
        const res = await fetch('/api/loginAPI', {
            method: "POST",
            body: JSON.stringify({
                userName: user
            })
        })

        const fullRes = await res.json()
        
        if(!fullRes.bool) {
            window.location.href = "/";
        }

        else{
            setLetLoose(true)
        }
    }

    const handleChange = (e) => {
        setMessageContent(e.target.value)
    }

    async function handleSubmit(e) {
        const today = new Date()
        const date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate() + ' ' + today.getHours() + ":" + today.getMinutes()

        e.preventDefault()

        setMessageContent("")

        const res = await fetch('../api/messagesAPI', {
            method: 'POST',
            body: JSON.stringify({
                receiver: user,
                date: date,
                content: messageContent
            })
        })
    }

    userDoesExist()

    if(!letLoose) return <h1>Loading</h1>

    return (
        <>
            <Head>
                <title>Saraha | {' ' + user}</title>
                <link rel="stylesheet" href="../messagingStyle.css" />
                <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
            </Head>

            <div id="wrapper">
                <h1>Write a message to {' ' + user}</h1>

                <form onSubmit={handleSubmit}>
                    <textarea onChange={handleChange} value={messageContent} name="messageContent" type="textarea"></textarea>
                    <input value="Send Message" type="submit" />
                </form>
            </div>
        </>
    )
}

export async function getServerSideProps(context) {
    const { params } = context

    return {
        props: {
            user: params.user
        }
    }
}