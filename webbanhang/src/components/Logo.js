import React from 'react'
import logohome from '../assets/logo-cellphones-removebg.png'
import { Link } from 'react-router-dom'

const Logo = ({ w, h }) => {
    return (
        <img width={w} height={h} src={logohome} />
    )
}

export default Logo
