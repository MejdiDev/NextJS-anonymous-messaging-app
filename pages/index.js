import Head from 'next/head'
import { useState } from 'react'

export default function Hello(){
  const emptySignupData = {fullName: "", userName: "", dateOfBirth: "", email: "", phoneNumber: "", password: ""}
  const emptyLoginData = {userName: "", password: ""}
  const [signupData, setSignupData] = useState(emptySignupData)
  const [loginData, setLoginData] = useState(emptyLoginData)

  const makeSlug = (length) => {
    const result           = ''
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }

    return result;
  }

  const handleChangeSignUp = (e) => {
    const formParent = e.target.parentNode.children

    console.log({
      fullName: formParent[1].value,
      userName: formParent[3].value,
      dateOfBirth: formParent[5].value,
      email: formParent[7].value,
      phoneNumber: formParent[9].value,
      password: formParent[11].value
    })
    
    setSignupData({
      fullName: formParent[1].value,
      userName: formParent[3].value,
      dateOfBirth: formParent[5].value,
      email: formParent[7].value,
      phoneNumber: formParent[9].value,
      password: formParent[11].value
    })
  }

  const handleChangeLogIn = (e) => {
    const formParent = e.target.parentNode.children

    setLoginData({
      userName: formParent[1].value,
      password: formParent[3].value
    })
  }

  async function handleSubmitSignUp(e){
    const confirmPass = document.getElementById('confirmPass').value
    e.preventDefault()

    if(confirmPass !== signupData.password) {
      return
    }

    const slug = makeSlug(9)

    const res = await fetch('/api/loginAPI', {
      method: 'POST',
      body: JSON.stringify({
        ...signupData,
        slug: slug
      })
    })

    const feedback = await res.json()
    
    if(feedback.error) {
      alert(feedback.error)
    }

    else {
      localStorage.setItem("slug", slug);
      window.location = "/dashboard"
      setSignupData(emptySignupData)
    }
  }

  async function handleSubmitLogin(e){
    e.preventDefault()

    const res = await fetch('/api/loginAPI', {
      method: 'POST',
      body: JSON.stringify(loginData)
    })

    const userExists = await res.json()

    if(userExists.error) {
      alert(userExists.error)
      return
    }

    else{
      if(userExists.bool) {
        localStorage.setItem("slug", userExists.slug);

        window.location = "/dashboard"
      }

      else {
        alert("wrong username !")
      }
    }
  }

  const changeForm = (e) => {
    if(e.target.innerText === "Log In") {
      document.getElementById('signupForm').style.transitionDelay = "0s"
      document.getElementById('loginForm').style.transitionDelay = "450ms"
      document.getElementById('signupForm').style.opacity = "0"
      document.getElementById('signupForm').style.visibility = "hidden"
      document.getElementById('formWrapper').classList.add('active')
      document.getElementById('loginForm').style.visibility = "visible"
      document.getElementById('loginForm').style.opacity = "1"
      document.querySelector('#buttonWrapper button:nth-child(1)').classList.add("active")
      document.querySelector('#buttonWrapper button:nth-child(3)').classList.remove("active")
    }

    else {
      document.getElementById('loginForm').style.transitionDelay = "0s"
      document.getElementById('signupForm').style.transitionDelay = "450ms"
      document.getElementById('loginForm').style.opacity = "0"
      document.getElementById('loginForm').style.visibility = "hidden"
      document.getElementById('formWrapper').classList.remove('active')
      document.getElementById('signupForm').style.visibility = "visible"
      document.getElementById('signupForm').style.opacity = "1"
      document.querySelector('#buttonWrapper button:nth-child(3)').classList.add("active")
      document.querySelector('#buttonWrapper button:nth-child(1)').classList.remove("active")
    }
  }

  return(
    <>
      <Head>
          <title>Saraha | Login</title>
          <link rel="stylesheet" href="index.css" />
          <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
      </Head>

      <div id="formWrapper">
        <form id="signupForm" onChange={handleChangeSignUp} onSubmit={handleSubmitSignUp}>
          <label>Full Name</label>
          <input value={signupData.fullName} type="text" placeholder="Full Name" />
          <label>Username</label>
          <input value={signupData.userName} type="text" placeholder="Username" />
          <label>Date Of Birth</label>
          <input value={signupData.dateOfBirth} type="date" placeholder="Date of birth" />
          <label>Email</label>
          <input value={signupData.email} type="email" placeholder="Email" />
          <label>Phone Number</label>
          <input value={signupData.phoneNumber} type="number" placeholder="Phone number" />
          <label>Password</label>
          <input value={signupData.password} type="password" placeholder="password" />
          <label>Confirm Your Password</label>
          <input id="confirmPass" type="password" placeholder="repeat you password" />
          <input value="Sign Up" type="submit" />
        </form>

        <form id="loginForm" onChange={handleChangeLogIn} onSubmit={handleSubmitLogin}>
          <label>Username</label>
          <input value={loginData.userName} type="text" placeholder="Username" />
          <label>Password</label>
          <input value={loginData.password} type="password" placeholder="Password" />
          <input value="Log In" type="submit" />
        </form>

        <div id="buttonWrapper">
          <button onClick={changeForm}>Log In</button>
          <div></div>
          <button class="active" onClick={changeForm}>Sign Up</button>
        </div>
      </div>
    </>
  )
}