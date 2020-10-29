import { Router } from "express";
import { requestInfoToResponseInfo, adjust530 } from "../utils";
import { mergeMasterDataResults } from "../utils/search";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import some from "lodash/some";
import { actions } from "../utils/search";
import { validatePensionNotificationRegisterSearchModel } from "../utils/modelValidation";
import envVariables from "../envVariables";
import mdmsData from "../utils/mdmsData";
import filter from "lodash/filter";
const asyncHandler = require("express-async-handler");

export default ({ config, db }) => {
  let api = Router();
  api.post(
    "/getMasterData",
    asyncHandler(async (request, res, next) => {
      //console.log(request.body.RequestInfo);
      let successStatus = false;

      let keyCode = request.body.KeyCode;

      let text = "SELECT mdv.value_id, mdv.name, mdv.description FROM tbl_master_data_value mdv join tbl_master_data_key mdk on mdk.key_id = mdv.key_id where mdk.active = true and mdv.active = true and mdk.code = '"+ keyCode+"'";

      let sqlQuery = text;
      //console.log(sqlQuery);
      let masterData = [];
      db.query(sqlQuery, async (err, dbRes) => {
        if (err) {
          console.log(err.stack);
          let response = {
            SuccessStatus:successStatus,
            ErrorMessage: err.stack
          };  
          res.json(response);          
        } else {
          masterData =
            dbRes.rows && !isEmpty(dbRes.rows)
              ? await mergeMasterDataResults(
                dbRes.rows,
                request.query,
                request.body
              )
              : [];

              successStatus = true;

          let response = {
            MasterData: masterData,
            SuccessStatus:successStatus
          };
          res.json(response);
        }
      });

    })
  );
  return api;
};
