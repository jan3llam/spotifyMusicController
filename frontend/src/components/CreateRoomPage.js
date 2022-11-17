import React, { Component ,useState } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { Link } from "react-router-dom";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { useNavigate } from "react-router";
import { Collapse } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";


export default function CreateRoomPage (props) {

	const navigate = useNavigate();

	const [guestCanPause, setGuestCanPause] = useState(props.guestCanPause);
	const [votesToSkip, setVotesToSkip] = useState(props.votesToSkip ? props.votesToSkip : 2);
	const [update, setUpdate] = useState(props.update ? props.update : false);
	const [roomCode, setRoomCode] = useState(props.roomCode ? props.roomCode :null);
	const [successMsg,setSuccessMsg] = useState("");
	const [errorMsg, setErrorMsg] = useState("");



	const handleVotesChange=(e)=> {
		setVotesToSkip(e.target.value)
	}

	const handleGuestCanPauseChange =(e)=> {

		setGuestCanPause(e.target.value === "true" ? true : false)

	}

	const handleRoomButtonPressed= async()=> {
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				votes_to_skip: votesToSkip,
				guest_can_pause: guestCanPause,
			}),
		};
		await fetch("/api/create-room", requestOptions)
		.then((response) => response.json())
		.then((data) => navigate("/room/" + data.code));
	}

	const renderCreateButton = () =>{
		return (
			 <Grid container spacing={1}>
       			 <Grid item xs={12} align="center">
		          <Button
		            color="primary"
		            variant="contained"
		            onClick={handleRoomButtonPressed}
		          >
		            Create A Room
		          </Button>
        		</Grid>
		        <Grid item xs={12} align="center">
		          <Button color="secondary" variant="contained" to="/" component={Link}>
		            Back
		          </Button>
		        </Grid>
	     	 </Grid>
			);
	}

	const renderUpdateButton = () =>{
		return (
			 <Grid container spacing={1}>
       			 <Grid item xs={12} align="center">
		          <Button
		            color="primary"
		            variant="contained"
		            onClick={handleUpdateButtonPressed}
		          >
		            Update
		          </Button>
        		</Grid>
	     	 </Grid>
			);
	}

	const handleUpdateButtonPressed= async()=> {
		const requestOptions = {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				votes_to_skip: votesToSkip,
				guest_can_pause: guestCanPause,
				code: roomCode,
			}),
		};
		await fetch("/api/update-room", requestOptions)
		.then((response) => {
			if(response.ok) {
				setSuccessMsg("Room updated successfully")
			}
			else {
				setErrorMsg("Error updating room")
				}
			props.updateCallback();
		});
	}


    const title = update ? "Update Room" : "Create a Room"

	return (
		<Grid container spacing={1}>
			<Grid item xs={12} align="center">
	          <Collapse in={errorMsg != "" || successMsg != ""}>
	            {successMsg != "" ? (
	              <Alert
	                severity="success"
	                onClose={() => {
	                  setSuccessMsg("");
	                }}>
	                {successMsg}
	              </Alert>
	            ) : (
	              <Alert
	                severity="error"
	                onClose={() => {
	                  setErrorMsg("");
	                }}>
	                {errorMsg}
	              </Alert>
	            )}
	          </Collapse>
			</Grid>
			<Grid item xs={12} align="center">
				<Typography component="h4" variant="h4">
				{title}
				</Typography>
			</Grid>
			<Grid item xs={12} align="center">
				<FormControl component="fieldset">
					<FormHelperText >
						<div align="center">Guest Control of Playback State</div>
					</FormHelperText>
					<RadioGroup
						row
						defaultValue={String(props.guestCanPause)}
						onChange={handleGuestCanPauseChange}
						>
					<FormControlLabel
						value="true"
						control={<Radio color="primary" />}
						label="Play/Pause"
						labelPlacement="bottom"
						/>
					<FormControlLabel
						value="false"
						control={<Radio color="secondary" />}
						label="No Control"
						labelPlacement="bottom"
						/>
					</RadioGroup>
				</FormControl>
			</Grid>
			<Grid item xs={12} align="center">
				<FormControl>
					<TextField
					required={true}
					type="number"
					onChange={handleVotesChange}
					defaultValue={votesToSkip}
					inputProps={{
						min: 1,
						style: { textAlign: "center" },
					}}
					/>
					<FormHelperText>
					<div align="center">Votes Required To Skip Song</div>
					</FormHelperText>
				</FormControl>
			</Grid>
			{update ? renderUpdateButton() : renderCreateButton()}
		</Grid>
		);

	}