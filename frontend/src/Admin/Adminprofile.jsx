import { useState } from "react";
import Halleyx from "../assets/halleyx-logo.svg";
import AdminNavbar from "./AdminNavbar";

const Adminprofile = () => {
  const [logo, setLogo] = useState(null);
  const [primaryColor, setPrimaryColor] = useState("#FF5733");
  const [secondaryColor, setSecondaryColor] = useState("#00AACC");
  const [font, setFont] = useState("Roboto");
  const [customHTML, setCustomHTML] = useState("");

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    const settings = {
      logo,
      primaryColor,
      secondaryColor,
      font,
      customHTML,
    };
    console.log("Saved settings:", settings);
    alert("Settings saved successfully!");
  };

  return (
    <>
      <AdminNavbar Halleyx={Halleyx} Highlight={"Admin profile"} />
      <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg mt-10 space-y-6 border">
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Customer Portal Branding Settings
        </h2>
 
        <div>
          <label className="font-semibold block mb-2">Logo Upload:</label>
          <input type="file" onChange={handleLogoUpload} className="mb-2" />
          {logo && (
            <div className="mt-2">
              <img
                src={logo}
                alt="Logo Preview"
                className="h-20 object-contain border p-2"
              />
            </div>
          )}
        </div>
<div>
          <label className="font-semibold block mb-2">Primary Color:</label>
          <input
            type="color"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            className="w-16 h-10 border"
          />
          <span className="ml-4">{primaryColor}</span>
        </div>
    <div>
          <label className="font-semibold block mb-2">Secondary Color:</label>
          <input
            type="color"
            value={secondaryColor}
            onChange={(e) => setSecondaryColor(e.target.value)}
            className="w-16 h-10 border"
          />
          <span className="ml-4">{secondaryColor}</span>
        </div> <div>
          <label className="font-semibold block mb-2">Font Family:</label>
          <select
            value={font}
            onChange={(e) => setFont(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="Roboto">Roboto</option>
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Georgia">Georgia</option>
            <option value="Courier New">Courier New</option>
            <option value="Times New Roman">Times New Roman</option>
          </select>
        </div>
 <div>
          <label className="font-semibold block mb-2">
            Custom HTML Block for Dashboard:
          </label>
          <textarea
            rows={5}
            value={customHTML}
            onChange={(e) => setCustomHTML(e.target.value)}
            className="border rounded p-2 w-full"
            placeholder="<p>Welcome to our customer portal!</p>"
          />
        </div>
 <div className="text-center">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Save Settings
          </button>
        </div>
      </div>
    </>
  );
};

export default Adminprofile;
