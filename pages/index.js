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
    const charactersLength = characters.length
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }

    return result
  }

  const handleChangeSignUp = (e) => {
    const formParent = e.target.parentNode.children
    
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

  async function handleSubmitSignUp(e) {
    const confirmPass = document.getElementById('confirmPass').value
    const parent = document.getElementById('signupForm').children
    const errorSignup = document.getElementById('errorSignup')
    const allFilled = true
    let HTMLarr = [].slice.call(parent);
    e.preventDefault()

    document.getElementById('formWrapper').style.height = "605px"

    HTMLarr.forEach((elm, index) => {
      parent[index].classList.remove('false')

      if((index % 2) !== 0 && String(elm.value).trim() === "") {
        parent[index].classList.add('false')
        allFilled = false
      }
    })

    if(!allFilled) {
      errorSignup.innerText = "Please fill out all the spaces !"
      errorSignup.classList.add('active')

      return
    }

    if(signupData.userName.includes(' ')) {
      parent[3].classList.add('false')
      errorSignup.innerText = "The username can't contain spaces !"
      errorSignup.classList.add('active')

      return
    }

    if(String(signupData.phoneNumber).length < 8) {
      parent[9].classList.add('false')
      errorSignup.innerText = "Please type in a real phone number !"
      errorSignup.classList.add('active')

      return
    }

    if(confirmPass !== signupData.password) {
      parent[13].classList.add('false')
      errorSignup.innerText = "The two passwords don't match !"
      errorSignup.classList.add('active')

      return
    }

    errorSignup.classList.remove('active')

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
      parent[3].classList.add('false')
      errorSignup.innerText = "Username already taken !"
      errorSignup.classList.add('active')

      return
    }

    document.getElementById('formWrapper').style.height = "560px"
    setSignupData(emptySignupData)
    localStorage.setItem("slug", slug)
    window.location = "/dashboard"
  }

  async function handleSubmitLogin(e) {
    const parent = document.getElementById('loginForm').children
    const allFilled = true
    let HTMLarr = [].slice.call(parent);
    e.preventDefault()

    HTMLarr.forEach((elm, index) => {
      parent[index].classList.remove('false')

      if((index % 2) !== 0 && String(elm.value).trim() === "") {
        parent[index].classList.add('false')
        allFilled = false
      }
    })

    if(!allFilled) {
      document.getElementById('formWrapper').style.height = "270px"
      document.getElementById('errorLogin').classList.add('active')
      document.getElementById('errorLogin').innerText = "Please fill out all the spaces !"
      return
    }

    const res = await fetch('/api/loginAPI', {
      method: 'POST',
      body: JSON.stringify(loginData)
    })

    const userExists = await res.json()

    if(userExists.error) {
      parent[3].classList.add('false')
      document.getElementById('formWrapper').style.height = "270px"
      document.getElementById('errorLogin').classList.add('active')
      document.getElementById('errorLogin').innerText = "wrong password !"

      return
    }

    if(!userExists.bool) {
      parent[1].classList.add('false')
      document.getElementById('formWrapper').style.height = "270px"
      document.getElementById('errorLogin').classList.add('active')
      document.getElementById('errorLogin').innerText = "Wrong username !"

      return
    }

    document.getElementById('formWrapper').style.height = "230px"
    document.getElementById('errorLogin').classList.remove('active')

    setLoginData(emptyLoginData)
    localStorage.setItem("slug", userExists.slug)
    window.location = "/dashboard"
  }

  const changeForm = (e) => {
    if(e.target.innerText === "Log In") {
      document.getElementById('signupForm').classList.remove('active')
      document.getElementById('formWrapper').style.height = (document.getElementById('errorLogin').classList.contains('active') ? "270px" : "230px")
      document.getElementById('formWrapper').classList.add('active')
      document.getElementById('loginForm').classList.add('active')
      document.querySelector('#buttonWrapper button:nth-child(1)').classList.add("active")
      document.querySelector('#buttonWrapper button:nth-child(3)').classList.remove("active")
    }

    else {
      document.getElementById('signupForm').classList.add('active')
      document.getElementById('formWrapper').style.height = (document.getElementById('errorSignup').classList.contains('active') ? "605px" : "560px")
      document.getElementById('formWrapper').classList.remove('active')
      document.getElementById('loginForm').classList.remove('active')
      document.querySelector('#buttonWrapper button:nth-child(1)').classList.remove("active")
      document.querySelector('#buttonWrapper button:nth-child(3)').classList.add("active")
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
        <form className='active' id="signupForm" onChange={handleChangeSignUp} onSubmit={handleSubmitSignUp}>
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
          <p id="errorSignup"></p>
          <input value="Sign Up" type="submit" />
        </form>

        <form id="loginForm" onChange={handleChangeLogIn} onSubmit={handleSubmitLogin}>
          <label>Username</label>
          <input value={loginData.userName} type="text" placeholder="Username" />
          <label>Password</label>
          <input value={loginData.password} type="password" placeholder="Password" />
          <p id="errorLogin"></p>
          <input value="Log In" type="submit" />
        </form>

        <div id="buttonWrapper">
          <button onClick={changeForm}>Log In</button>
          <div></div>
          <button className="active" onClick={changeForm}>Sign Up</button>
        </div>
      </div>
    </>
  )
}