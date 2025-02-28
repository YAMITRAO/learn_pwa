import React, { useState, useEffect } from "react";

const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Listen for the 'beforeinstallprompt' event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the default install prompt from showing
      e.preventDefault();
      console.log("beforeinstallprompt event fired");

      // Save the event so it can be triggered later
      setDeferredPrompt(e);
      setShowButton(true); // Show the "Install" button
    };

    // Add event listener to listen for the 'beforeinstallprompt' event
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      // Clean up the event listener when the component unmounts
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  // Handle the "Install" button click event
  const handleInstallClick = () => {
    console.log("the deferredPrompt is", deferredPrompt);
    if (deferredPrompt) {
      // Show the installation prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        // Reset the deferredPrompt and hide the button
        setDeferredPrompt(null);
        setShowButton(false);
      });
    }
  };

  return (
    // showButton && (
    <button onClick={handleInstallClick} style={buttonStyles}>
      {showButton ? "Install True" : "Install False"}
    </button>
  );
  // );
};

const buttonStyles = {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  padding: "10px 20px",
  backgroundColor: "#007bff",
  color: "white",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
};

export default InstallButton;
