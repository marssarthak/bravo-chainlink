import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useAccount } from "wagmi";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { ConnectKitButton } from "connectkit";
import Username from "@/components/username";
import DetailsInput from "@/components/DetailsInput";
import { registerUser } from "../sqls/query";

export default function Home() {
  const [location, setLocation] = useState();
  useEffect(() => {
    setLocation(window.location);
  }, []);

  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="p-4 sm:ml-64 pt-20 bg-gray-900 w-full h-screen">
          <div className="text-white">
            <div className="mt-10">
              <h1 className="font-bold text-3xl text-center">Login</h1>
            </div>
            <div className="mt-8 w-3/4 mx-auto">
              <HorizontalLinearStepper />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const steps = ["Connect wallet", "Choose username", "Additional details"];

function HorizontalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);

  const [formData, setFormData] = useState({
    address: "",
    username: "",
    email: "",
    name: "",
  });

  
  async function signupUser(formData){
    const response = await registerUser(formData.address, formData.username, formData.email, formData.name);
    console.log(response)
  }

  const { address, isConnecting, isDisconnected } = useAccount();

  useEffect(() => {
    if (address && address !== "") {
      setFormData((prev) => ({ ...prev, address }));
    }
    if (isDisconnected) {
      setFormData((prev) => ({ ...prev, address: "" }));
    }
  }, [address]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if (activeStep === steps.length-1) {
      signupUser(formData);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const isNextDisabled = (index) => {
    if (index === 0) {
      return formData.address === "";
    }
    if (index === 1) {
      return formData.username === "";
    }
    if (index === 2) {
      return formData.name === "" || formData.email === "";
    }
    return false;
  };

  return (
    <Box sx={{ width: "100%", color: "white" }}>
      <Stepper sx={{ color: "white" }} activeStep={activeStep}>
        {steps.map((label, index) => {
          return (
            <Step sx={{ color: "white" }} key={label}>
              <StepLabel sx={{ color: "white" }}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>Login Successfull</Typography>
        </React.Fragment>
      ) : (
        <React.Fragment>
    
          {activeStep === 0 ? (
            <div className="mt-8">
              <ConnectKitButton />
            </div>
          ) : null}
          {activeStep === 1 ? (
            <>
              <Username
                handleNext={handleNext}
                setUserNameGlobal={(name) =>
                  setFormData((prev) => ({ ...prev, username: name }))
                }
              />
            </>
          ) : null}

          {activeStep === 2 ? (
            <>
              <DetailsInput setFormData={setFormData} />
            </>
          ) : null}

          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />

            <Button disabled={isNextDisabled(activeStep)} onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}
