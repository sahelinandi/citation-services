import { version } from "../../package.json";
import { Router } from "express";
import userAuth from "./userAuth";
import saveApplication from "./saveApplication";
import getApplicationCount from "./getApplicationCount";
import getDistrict from "./getDistrict";
import getBlock from "./getBlock";
import getMasterData from "./getMasterData";
import getApplicationDetails from "./getApplicationDetails";
import uploadFile from "./uploadFile";
import downloadFile from "./downloadFile";
import getCountry from "./getCountry";
import getFundingAgency from "./getFundingAgency";
import getSubSBU from "./getSubSBU";
import getProjectType from "./getProjectType";
import saveProject from "./saveProject";
import getProjects from "./getProjects";

export default ({ config, db }) => {
  let api = Router();

  api.use("/citation-services/v1", userAuth({ config, db }));
  api.use("/citation-services/v1", saveApplication({ config, db }));
  api.use("/citation-services/v1", getApplicationCount({ config, db }));
  api.use("/citation-services/v1", getDistrict({ config, db }));
  api.use("/citation-services/v1", getBlock({ config, db }));
  api.use("/citation-services/v1", getMasterData({ config, db }));
  api.use("/citation-services/v1", getApplicationDetails({ config, db }));
  api.use("/citation-services/v1", uploadFile({ config, db }));
  api.use("/citation-services/v1", downloadFile({ config, db }));
  api.use("/citation-services/v1", getCountry({ config, db }));
  api.use("/citation-services/v1", getFundingAgency({ config, db }));
  api.use("/citation-services/v1", getSubSBU({ config, db }));
  api.use("/citation-services/v1", getProjectType({ config, db }));
  api.use("/citation-services/v1", saveProject({ config, db }));
  api.use("/citation-services/v1", getProjects({ config, db }));
  // perhaps expose some API metadata at the root
  api.get("/", (req, res) => {
    res.json({ version });
  });

  return api;
};
