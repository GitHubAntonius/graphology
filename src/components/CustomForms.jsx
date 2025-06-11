import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { graphologyAction } from "../features/graphology/graphologySlice"
import data_source from "../config/graphology/data_source.json"

const CustomForms = () => {
    const dispatch = useDispatch()

    const formList = data_source.graphology.form_list
    // console.log(`#@ Form List: `, formList)

    // Variable
    const pageState = useSelector((state) => state.graphology.pageState)
    const conclusions = useSelector((state) => state.graphology.conclusions)
    const resetCustomForm = useSelector((state) => state.graphology.resetCustomForm)

    const options = [
        { value: 'tinggi', label: 'Tinggi' },
        { value: 'sedang', label: 'Sedang' },
        { value: 'rendah', label: 'Rendah' }
    ];

    const [nameVal, setNameVal] = useState('')
    const [ageVal, setAgeVal] = useState('')
    const [menuActive, setMenuActive] = useState([false, false, false, false, false, false, false, false, false])
    const [checkedItems, setCheckedItems] = useState({})
    const [selectedValue, setSelectedValue] = useState({});
    const [resultItems, setResultItems] = useState({})
    const [popupVisible, setPopupVisible] = useState(false)
    const [popupObject, setPopupObject] = useState({})
    const [obVal, setObVal] = useState('')
    const [totalVal, setTotalVal] = useState('')
    const [readyToSubmit, setReadyToSubmit] = useState(false)

    // Functions
    const handleCheckboxChange = (menu, group, item) => {
        setCheckedItems(prevState => ({
            ...prevState,
            [`${menu}~${group}~${item}`]: !prevState[`${menu}~${group}~${item}`]
        }))
    }

    const handleChangeSelect = (e, menu, group, item) => {
        if (selectedValue[`${menu}~${group}~${item}`] && e.target.value === 'remove') {
            // Remove the item from resultItems
            const { [`${menu}~${group}~${item}`]: removed, ...rest } = resultItems
            setResultItems(rest)

            setSelectedValue({
                ...selectedValue,
                [`${menu}~${group}~${item}`]: 'remove'
            })
        } else {
            const selected = options.find(opt => opt.value === e.target.value)
            const dataObj = { id: `${menu}~${group}~${item}`, ob: 0, total: 0, percent: 0, result: selected.label }

            // console.log(`#@ Data : `, menu, group, item, selected)

            setSelectedValue({
                ...selectedValue,
                [`${menu}~${group}~${item}`]: selected.value
            })

            handleResultChange(dataObj)
        }
    }

    const handleResultChange = (obj) => {
        const idAry = obj.id.split('~')

        setResultItems(prevState => ({
            ...prevState,
            [`${obj.id}`]: { list: formList[idAry[0]].submenu[idAry[1]].list[idAry[2]], ob: obj.ob, total: obj.total, percent: obj.percent, result: obj.result }
        }))
    }

    const onClickMenu = (val) => {
        // console.log(`#@ onClickMenu : `, val)

        let tmpAry = [...menuActive]
        tmpAry[val.menuIndex] = !tmpAry[val.menuIndex]
        setMenuActive(tmpAry)
    }

    const onClickInput = (e) => {
        // console.log(`#@ onClickInput : `, e.target.name)
        e.preventDefault()

        const [menu, group, item] = e.target.name.split('~')
        let tmpObj = { ...popupObject }

        tmpObj.id = `${menu}~${group}~${item}`
        tmpObj.menu = (formList[menu].menu).toUpperCase()
        tmpObj.submenu = formList[menu].submenu[group].group
        tmpObj.list = formList[menu].submenu[group].list[item]

        let _ob = (resultItems[`${menu}~${group}~${item}`]) ? resultItems[`${menu}~${group}~${item}`].ob : 0
        let _total = (resultItems[`${menu}~${group}~${item}`]) ? resultItems[`${menu}~${group}~${item}`].total : 0

        setObVal(_ob)
        setTotalVal(_total)

        setPopupObject(tmpObj)
        setPopupVisible(true)
    }

    const onClickSubmit = (e) => {
        // console.log(`#@ handleSubmit`, e.target)
        e.preventDefault()

        if (!e.target.ob.value) {
            // notificationMessage = 'Name is required'
        } else if (!e.target.total.value) {
            // notificationMessage = 'Age is required'
        } else {
            const dataObj = resultPreview({ obVal, totalVal }, 'data')

            handleResultChange(dataObj)
            setPopupVisible(false)
        }
    }

    const onClickCancel = (e) => {
        // console.log(`#@ onClickCancel ...`)
        e.preventDefault()
        setPopupVisible(false)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const propertyNames = Object.keys(checkedItems)

        let tmpMenuId = '-1'
        let result = {}

        for (let propertyName of propertyNames) {
            let menuId

            if (propertyName.split('~')[0] !== tmpMenuId) {
                tmpMenuId = propertyName.split('~')[0]
                menuId = propertyName
            } else {
                menuId = `${propertyName}~none`
                // menuId = `none${propertyName.substring(1)}`
            }

            if (checkedItems[propertyName] === true && resultItems[propertyName]) {
                result[menuId] = resultItems[propertyName]
            }
        }

        dispatch(graphologyAction.SET_STATE({
            conclusions: result,
            pageState: 'conclusion',
            clientName: nameVal,
            clientAge: ageVal
        }))
    }

    const resultPreview = (obj, type) => {
        let msg = ''
        let data = {}
        let percent = 0
        let result = ''

        if (obj.obVal && obj.totalVal) {
            percent = ((obj.obVal / obj.totalVal) * 100).toFixed(2)

            if (percent >= 0 && percent <= 30) {
                result = 'Rendah'
            } else if (percent > 30 && percent <= 60) {
                result = 'Sedang'
            } else if (percent > 60) {
                result = 'Tinggi'
            }
        }

        msg = `Persentase : ${percent} % - ${result}`
        data = { id: popupObject.id, ob: obj.obVal, total: obj.totalVal, percent, result }

        return type === 'message' ? msg : data
    }

    const renderFormList = () => {
        return (
            <div className="dropdown-menu">
                {formList.map((menuItem, menuIndex) => (
                    <div key={menuIndex}>
                        <div className="text menu" onClick={() => onClickMenu({ menuIndex })}>{(menuItem.menu).toUpperCase()}
                            <span className={`icon${menuActive[menuIndex] ? ' active' : ''}`}></span>
                        </div>
                        {menuItem.submenu.map((submenuItem, submenuIndex) => (
                            <div className={`submenu${menuActive[menuIndex] ? '' : ' hide'}`} key={submenuIndex}>
                                <div className={`text${submenuItem.group !== '-' ? ' submenu' : ' hide'}`}>{submenuItem.group}</div>
                                <ul>
                                    {submenuItem.list.map((listItem, listIndex) => (
                                        <li className="list" key={listIndex}>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={checkedItems[`${menuIndex}~${submenuIndex}~${listIndex}`] || false}
                                                    onChange={() => handleCheckboxChange(menuIndex, submenuIndex, listIndex)}
                                                />
                                                <div className="text list">{listItem}</div>
                                            </label>
                                            <div className="data-editor">
                                                <select
                                                    className="selector"
                                                    value={selectedValue[`${menuIndex}~${submenuIndex}~${listIndex}`] || 'remove'}
                                                    onChange={(event) => handleChangeSelect(event, menuIndex, submenuIndex, listIndex)}
                                                    disabled={!checkedItems[`${menuIndex}~${submenuIndex}~${listIndex}`]}>
                                                    <option value="remove">Nilai</option>
                                                    {options.map(opt => (
                                                        <option key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    className="btn" name={`${menuIndex}~${submenuIndex}~${listIndex}`}
                                                    onClick={onClickInput}
                                                    disabled={!checkedItems[`${menuIndex}~${submenuIndex}~${listIndex}`] ? true : !selectedValue[`${menuIndex}~${submenuIndex}~${listIndex}`] || selectedValue[`${menuIndex}~${submenuIndex}~${listIndex}`] === 'remove' ? false : true}
                                                >
                                                    Input
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                ))}
                <br></br>
            </div>
        )
    }

    const renderFormInput = () => {
        return (
            <div className={`input-data${popupVisible ? '' : ' hide'}`}>
                <div className="popup-form">
                    <div className="popup-menu">{popupObject.menu}</div>
                    <div className="popup-list">{`${popupObject.list}`}</div>
                    <form className="form-input" onSubmit={onClickSubmit}>
                        <div className="input-group">
                            <label htmlFor="ob" style={{ opacity: 0.5 }}>OB</label>
                            <input
                                type="number"
                                id="ob"
                                placeholder="0"
                                required
                                onChange={(e) => setObVal(e.target.value)}
                                value={obVal}
                                disabled={false}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="total" style={{ opacity: 0.5 }}>Total</label>
                            <input
                                type="number"
                                id="total"
                                placeholder="0"
                                required
                                onChange={(e) => setTotalVal(e.target.value)}
                                value={totalVal}
                                disabled={false}
                            />
                        </div>
                        <p>{resultPreview({ obVal, totalVal }, 'message')}</p>
                        <button className="primary" disabled={false}>SUBMIT</button>
                        <button className="primary" onClick={onClickCancel} disabled={false}>CANCEL</button>
                    </form>
                </div >
            </div>
        )
    }

    const resetPage = () => {
        setNameVal('')
        setAgeVal('')
        setMenuActive([false, false, false, false, false, false, false, false, false])
        setCheckedItems({})
        setSelectedValue({})
        setResultItems({})
        setPopupVisible(false)
        setPopupObject({})
        setObVal('')
        setTotalVal('')
        setReadyToSubmit(false)
    }

    useEffect(() => {
        const propertyNames = Object.keys(checkedItems)

        for (let propertyName of propertyNames) {
            if (checkedItems[propertyName] === true && resultItems[propertyName]) {
                setReadyToSubmit(true)
                return
            }

            setReadyToSubmit(false)
        }
    }, [checkedItems, resultItems])

    useEffect(() => {
        // console.log(`#@ checkedItems : `, checkedItems)
    }, [checkedItems])

    useEffect(() => {
        // console.log(`#@ selectedValue : `, selectedValue)
    }, [selectedValue])

    useEffect(() => {
        // console.log(`#@ resultItems : `, resultItems)
    }, [resultItems])

    useEffect(() => {
        // console.log(`#@ popupVisible : `, popupVisible)
    }, [popupVisible])

    useEffect(() => {
        // console.log(`#@ menuActive : `, menuActive)
    }, [menuActive])

    useEffect(() => {
        // console.log(`#@ conclusions : `, conclusions)
    }, [conclusions])

    useEffect(() => {
        // console.log(`#@ resetCustomForm: `, resetCustomForm)
        if (resetCustomForm) {
            resetPage()
            dispatch(graphologyAction.SET_STATE({ resetCustomForm: false }))
        }
    }, [resetCustomForm])

    return (
        <div className={`assessment-container${pageState === 'customForm' ? '' : ' hide'}`}>
            <div>
                <div className="title">SET CUSTOM FORM</div>
                <form className="form-identity" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="name" style={{ opacity: 0.5 }}>Name</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Name"
                            required
                            onChange={(e) => setNameVal(e.target.value)}
                            value={nameVal}
                            disabled={false}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="age" style={{ opacity: 0.5 }}>Age</label>
                        <input
                            type="text"
                            id="age"
                            placeholder="Age"
                            required
                            onChange={(e) => setAgeVal(e.target.value)}
                            value={ageVal}
                            disabled={false}
                        />
                    </div>
                </form>
                <div>{renderFormList()}</div>
                <button className="primary" onClick={handleSubmit} disabled={!readyToSubmit}>
                    SUBMIT
                </button>
            </div>
            {renderFormInput()}
        </div>
    )
}

export default CustomForms