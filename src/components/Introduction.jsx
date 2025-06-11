import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { graphologyAction } from "../features/graphology/graphologySlice"
import data_source from "../config/graphology/data_source.json"

const Introduction = () => {
    const dispatch = useDispatch()

    // Variable
    const textIntroduction = data_source.graphology.introduction
    const pageState = useSelector((state) => state.graphology.pageState)
    const userName = 'PrimBalance'
    const userPassword = '000000'

    const [userVal, setUserVal] = useState('')
    const [passwordVal, setPasswordVal] = useState('')

    // Functions
    const handleSubmit = (e) => {
        e.preventDefault()

        if (!e.target.username.value) {
            // notificationMessage = 'Username is required'
        } else if (!e.target.password.value) {
            // notificationMessage = 'Password is required'
        } else if (e.target.username.value === userName && e.target.password.value === userPassword) {
            dispatch(graphologyAction.SET_STATE({ pageState: 'customForm' }))
        }
    }

    useEffect(() => {

    }, [])

    return (
        <div className={`introduction-container${pageState === 'introduction' ? '' : ' hide'}`}>
            <div className="title">GRAPHOLOGY</div>
            <div className="text">{textIntroduction}</div>
            <form className="form-login" onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="username" style={{ opacity: 0.5 }}>Username</label>
                    <input
                        type="text"
                        autoComplete="username"
                        id="username"
                        placeholder="Username"
                        required
                        onChange={(e) => setUserVal(e.target.value)}
                        value={userVal}
                        disabled={false}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password" style={{ opacity: 0.5 }}>Password</label>
                    <input
                        type="password"
                        autoComplete="new-password"
                        id="password"
                        placeholder="Password"
                        required
                        onChange={(e) => setPasswordVal(e.target.value)}
                        value={passwordVal}
                        disabled={false}
                    />
                </div>
                <button className="primary" disabled={false}>
                    LOGIN
                </button>
            </form>
        </div >
    )
}

export default Introduction