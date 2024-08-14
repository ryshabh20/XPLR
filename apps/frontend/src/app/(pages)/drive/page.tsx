"use client";
import Button from "@/components/common/button";
import { access } from "fs";
import useDrivePicker from "react-google-drive-picker";
const Page = () => {
  //   const { handleSubmit, control, formState, getFieldState } = useForm({
  //     mode: "onChange",
  //   });
  const [openPicker, authResponse] = useDrivePicker();

  const handleOpenPicker = () => {
    const accessToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token" + "="))
      ?.split("=")[1];
    console.log(accessToken);
    openPicker({
      clientId: process.env.CLIENT_ID as string,
      developerKey: process.env.DEVELOPER_KEY as string,
      viewId: "DOCS",
      token: accessToken, // pass oauth token in case you already have one
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      // customViews: customViewsArray, // custom view
      callbackFunction: (data) => {
        if (data.action === "cancel") {
          console.log("User clicked cancel/close button");
        }
        console.log(data);
      },
    });
  };
  return <Button onClick={handleOpenPicker}> </Button>;
};

export default Page;
