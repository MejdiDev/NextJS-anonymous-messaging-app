import { useState, useEffect } from 'react'
import useSWR from 'swr'
import Head from 'next/head'

export default function UserData() {
    const [letLoose, setLetLoose] = useState(false)

    const handleLogout = () => {
        localStorage.removeItem("slug")
        window.location = "/"
    }

    async function checkUser() {
        if(typeof(document) !== undefined) {
            if(!localStorage.getItem("slug")) {
                window.location = "/"
            }

            else{
                setLetLoose(true)
            }
        }
    }

    async function fetcher() {
        const res = await fetch('/api/checkUserAPI', {
            method: "POST",
            body: JSON.stringify(localStorage.getItem("slug"))
        })
        
        const userData = await res.json()

        return userData
    }

    const showFullMessage = (e) => {
        document.getElementById('overlay').style.overflowY = "auto"
        document.getElementById('overlay').style.visibility = "visible"
        document.getElementById('fullLink').style.visibility = "hidden"
        document.getElementById('fullMessage').style.visibility = "visible"
        document.getElementById('fullMessage').innerText = data[e.target.id].content

        document.getElementById('overlay').classList.remove('tooBigContainer')

        if(document.getElementById('fullMessage').offsetHeight > document.querySelector('body').offsetHeight) {
            document.getElementById('overlay').classList.add('tooBigContainer')
        }
    }

    const hideOverlay = (e) => {
        if(e.target.id === "overlay") {
            e.target.style.overflowY = "hidden"
            e.target.style.visibility = "hidden"
            e.target.children[0].style.visibility = "hidden"
            e.target.children[1].style.visibility = "hidden"
        }
    }

    const showLink = () => {
        document.getElementById('overlay').classList.remove('tooBigContainer')
        document.getElementById('fullMessage').style.visibility = "hidden"
        document.getElementById('overlay').style.visibility = "visible"
        document.getElementById('fullLink').style.visibility = "visible"
    }

    const copyToClipboard = () => {
        document.querySelector('#fullLink input').focus()
        document.querySelector('#fullLink input').select()

        try {
            document.execCommand('copy')
        } catch (err) {
            console.log(err)
        }
    }

    const showMobileNavigation = () => {
        document.getElementById('slideOverlay').classList.add('active')
        document.getElementById('sidebar').classList.add('active')
    }

    const hideSlideOverlay = () => {
        document.getElementById('slideOverlay').classList.remove('active')
        document.getElementById('sidebar').classList.remove('active')
    }

    const { data } = useSWR('getMessages', fetcher)
    let messages = ""
    let numMessages = 0

    useEffect(() => {
        checkUser()
    }, [])

    
    if (data) {
        if(data.length > 1) {
            numMessages = data.length - 1

            messages = data.map((message, index) => {
                if(index !== data.length - 1) {
                    return (<p onClick={showFullMessage} id={index} key={index}>{message.content}</p>)
                }
            })
        }
    
        else {
            messages = <h1>No messags to show !</h1>
        }
    }
    

    if (!letLoose || !data) return (<h1>Loading</h1>)

    return(
        <>
            <Head>
                <title>Saraha | Dashboard</title>
                <link rel="stylesheet" href="dashboardStyle.css" />
                <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
            </Head>

            <div id="sidebar">
                <header>
                    <h1>Hello {' ' + data[data.length - 1]}</h1>

                    <h3>You received {' ' + numMessages + ' '} message{(data.length > 2) ? 's' : ''}</h3>

                    <div id="buttonWrapper">
                        <button id="logoutButton" onClick={handleLogout}>Log Out</button>
                        <button id="linkButton" onClick={showLink}>Your Messaging Link</button>
                    </div>
                </header>
            </div>

            <div onClick={hideSlideOverlay} id="slideOverlay"></div>

            <div id="overlay" onClick={hideOverlay}>
                <div id="fullMessage"></div>
                <div id="fullLink">
                    <input type="text" value={'http://localhost:3000/writeTo/' + data[data.length - 1]}/>
                    <div onClick={copyToClipboard} id="copyButton"></div>
                </div>
            </div>

            <div id="mobileNavigation">
                <h1>Your messages :</h1>
                <div onClick={showMobileNavigation}></div>
            </div>

            {messages}
        </>
    )
}