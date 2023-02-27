import React, { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import './ISODashboard.css';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function ISODashboard({ loggedIn, setLoggedIn }) {
    setLoggedIn(true)
    const [file, setFile] = useState(null);
    const [open, setOpen] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openReadSuccess, setOpenReadSuccess] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [loading, setLoading] = useState(false)

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseSuccess = () => {
        setOpenSuccess(false);
    };

    const handleCloseReadSuccess = () => {
        setOpenReadSuccess(false);
        setLoading(false)
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    }

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append('file', file);
        console.log(formData.file)
        // null check
        if (!formData) {
            setOpen(true)
            setIsUploaded(false);
        }
        else {
            console.log("aaaaaaaaaaaaaaaa")  
            console.log(loading)          
            fetch('http://localhost:8080/api/upload', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => console.log(data))
                .catch(error => console.error(error));
            setIsUploaded(true)
            setOpenSuccess(true)
            //setLoading(false)
        }

    }

    const handleRead = () => {
        setLoading(true)
        if (isUploaded === false) {
            setOpen(true)
        }
        else {
            fetch('http://localhost:8080/api/read', {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => console.log(data))
                .then((result)=>{
                    setOpenReadSuccess(true)
                });   
        }
    }

    return (
        <Container>
            <Row>
                <Col>
                    <Container className="ISO">
                        <Row>
                            <Col><input type="file" onChange={handleFileChange} /></Col>
                        </Row>
                        <Row>
                            <Col><button onClick={handleSubmit}>Submit</button></Col>
                        </Row>
                    </Container>
                </Col>
                <Col>
                    <Container className="ISO">
                        <Row><div className="weirdFlex"></div></Row>
                        <Row>
                            <Col><button className="myButton" onClick={handleRead}>Process Current File</button></Col>
                            {loading && <p>Loading...</p>}
                        </Row>
                    </Container>
                </Col>
            </Row>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle >
                    Please enter a file first!
                </DialogTitle>
                <DialogContent>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>OK</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openSuccess} onClose={handleCloseSuccess}>
                <DialogTitle >
                    File Upload Success!
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        You have successfully uploaded your file!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseSuccess}>OK</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openReadSuccess} onClose={handleCloseReadSuccess}>
                <DialogTitle >
                    File Read Success!
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        You have successfully read the file!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseReadSuccess}>OK</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default ISODashboard;
