import React, { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { graphologyAction } from "../features/graphology/graphologySlice"
import data_source from "../config/graphology/data_source.json"
import data_result from "../config/graphology/data_result.json"

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

import imgPDF from '../assets/svg/downloadPDF.svg'
import imgTXT from '../assets/svg/downloadTXT.svg'

const Conclusions = () => {
    const dispatch = useDispatch()

    // Conclusions Text
    const formList = data_source.graphology.form_list
    const resultText = data_result.graphology.result_text
    // console.log(`#@ resultText: `, resultText)

    // Variable
    const pageState = useSelector((state) => state.graphology.pageState)
    const clientName = useSelector((state) => state.graphology.clientName || 'Graphology Client')
    const clientAge = useSelector((state) => state.graphology.clientAge || 0)
    const conclusions = useSelector((state) => state.graphology.conclusions)

    const [result, setResult] = useState([])

    // Process Conclusions
    const generateConclusions = (data) => {
        return (
            <div>
                {Object.keys(data).map((item, index) => (
                    <div key={item}>
                        {item.split('~').length !== 4 ? <h2>{formList[Number(item.split('~')[0])].menu}</h2> : null}
                        {
                            conclusions[item].percent !== 0 ?
                                <h3>{`${conclusions[item].list} (OB: ${conclusions[item].ob}, Total: ${conclusions[item].total}, Percent: ${conclusions[item].percent}%, Result: ${conclusions[item].result})`}</h3>
                                : <h3>{`${conclusions[item].list} (Result: ${conclusions[item].result})`}</h3>
                        }
                        {renderTextType(resultText[item.split('~')[0]][item.split('~')[1]][Number(item.split('~')[2]) + 1][conclusions[item].result.toLowerCase()])}
                    </div>
                ))}
            </div>
        )
    }

    const renderTextType = (data) => {
        // console.log(`#@ param: `, data)

        if (data.text.length === 0) return

        switch (data.type) {
            case 'heading1':
                return (
                    <div key={'txt' + index}>
                        <h1>{data.text}</h1>
                        <br></br>
                    </div>
                )
            case 'heading2':
                return (
                    <div key={'txt' + index}>
                        <h2>{data.text}</h2>
                    </div>
                )
            case 'paragraph':
                return (
                    <div key={'txt' + index}>
                        <p>{data.text}</p>
                        <br></br>
                    </div>
                )
            case 'column_ol':
                return (
                    <div key={'txt'} className="column">
                        <ol key={'txt-ol'}>
                            {
                                data.text.map((ol, ol_idx) => {
                                    return <li key={'ol' + ol_idx}>{ol}</li>
                                })
                            }
                            <br></br>
                        </ol>
                    </div>
                )
            case 'column_ul':
                return (
                    <div key={'txt' + index} className="column">
                        {
                            data.text.map((ul, ul_idx) => {
                                return (
                                    <ul key={'txt-ul' + index + ul_idx}>
                                        {
                                            ul.map((sub_ul, sub_ul_idx) => {
                                                return <li key={'ul' + index + ul_idx + sub_ul_idx}>{sub_ul}</li>
                                            })
                                        }
                                        <br></br>
                                    </ul>
                                )
                            })
                        }
                    </div>
                )
        }
    }

    // Funtio to handle downloading the HTML as an TXT file
    const handleDownloadTxt = () => {
        const divElement = document.getElementById('htmlContent');
        if (!divElement) return;

        const divText = divElement.innerText;
        const blob = new Blob([divText], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const fileName = `Hasil Penilaian ${clientName}.txt`

        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        document.body.appendChild(link)
        link.click();

        // Clean up
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
    }

    // Function to handle downloading the HTML as a PDF
    const handleDownloadPdf = () => {
        // Select the content you want to download as PDF
        const content = document.getElementById('htmlContent')
        const fileName = `Hasil Penilaian ${clientName}.pdf`

        // Use html2canvas to capture the content as an image
        html2canvas(content)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png')

                // Initialize jsPDF
                const pdf = new jsPDF('p', 'mm', 'a4')
                const imgWidth = 210 // PDF width in mm (A4 size)
                const pageHeight = 297 // PDF height in mm (A4 size)
                const imgHeight = (canvas.height * imgWidth) / canvas.width
                let heightLeft = imgHeight
                let position = 0

                // Add the image to the PDF
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
                heightLeft -= pageHeight

                // Add pages if content is longer than one page
                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight
                    pdf.addPage()
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
                    heightLeft -= pageHeight
                }

                // Download the PDF
                pdf.save(fileName)
            })
            .catch((err) => {
                console.error('Failed to generate PDF', err)
            })
    }

    // Input Another Person
    const editThisData = () => {
        dispatch(graphologyAction.SET_STATE({
            pageState: 'customForm'
        }))
    }

    // Input Another Person
    const inputNewData = () => {
        dispatch(graphologyAction.SET_STATE({
            pageState: 'customForm',
            clientName: '-',
            clientAge: 0,
            conclusions: {},
            resetCustomForm: true
        }))
    }

    useEffect(() => {
        // console.log(`#@ pageState: `, pageState)
    }, [pageState])

    useEffect(() => {
        // console.log(`#@ conclusions: `, conclusions)
    }, [conclusions])

    useEffect(() => {

    }, [])

    return (
        <div className={`result-container${pageState === 'conclusion' ? '' : ' hide'}`}>
            <div id="htmlContent" className="result">
                <div className="title">HASIL PENILAIAN</div>
                <p>{`Nama : ${clientName}`}</p>
                <p>{`Usia : ${clientAge}`}</p>
                <br></br>
                {generateConclusions(conclusions)}
                {result[0] ? renderResultPage(result[0][0]) : null}
                {result.length > 1 && result[1] ? renderResultPage(result[1][0]) : null}
            </div>
            <div className="btn-group">
                <div className="download">
                    <div className="button-download" onClick={handleDownloadPdf}><img className="icon" src={imgPDF} /></div>
                    <div className="button-download" onClick={handleDownloadTxt}><img className="icon" src={imgTXT} /></div>
                </div>
                <div className="menu">
                    <button className="button-custom" onClick={editThisData}>Edit This Data</button>
                    <button className="button-custom" onClick={inputNewData}>Input New Data</button>
                </div>
            </div>
        </div >
    )
}

export default Conclusions