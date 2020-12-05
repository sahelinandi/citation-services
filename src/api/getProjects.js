import { Router } from "express";
import { requestInfoToResponseInfo, adjust530 } from "../utils";
import { mergeProjectDataResults } from "../utils/search";
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
    "/getProjects",
    asyncHandler(async (request, res, next) => {
      //console.log(request.body.RequestInfo);

      let successStatus = false;

      let projectName = request.body.data[0].projectName;
      let clientName = request.body.data[0].clientName;
      let startDate = request.body.data[0].startDate;
      let endDate = request.body.data[0].endDate;
      let projectValueFrom = request.body.data[0].projectValueFrom;
      let projectValueTo = request.body.data[0].projectValueTo;
      let region =  request.body.data[0].region;
      let architectureType =  request.body.data[0].architectureType;
      let technology = request.body.data[0].technologies;
      let domainName = request.body.data[0].domainnames;

    //  let text = "SELECT p.project_id, p.project_name, p.client_name, p.project_start_date, p.project_end_date from tbl_project p where p.active = true and p.project_name = '"+ projectName+"'";
    let text = "SELECT distinct p.project_id, p.project_name, p.client_name,to_char(p.project_start_date,'dd/mm/yyyy')project_start_date, to_char(p.project_end_date,'dd/mm/yyyy')project_end_date,p.project_value,(select m.description	from tbl_master_data_value m	where m.key_id = 4 and m.value_id = p.currency_id) currency,(select m.description from tbl_master_data_value m where	m.key_id = 2 and m.value_id = P.region_id ) region,	(select tc.name from tbl_country tc where	tc.country_id = P.country_id ) country ,(select tfa.name from tbl_funding_agency tfa where tfa.funding_agency_id = p.funding_agency_id ) funding_agency,(select	tpt.name from	tbl_project_type tpt where	tpt.project_type_id = p.project_type_id ) project_type,p.is_network_firm_opportunity,p.pwc_india_value,(select	tss.name from	tbl_sub_sbu tss where	tss.sub_sbu_id = p.sub_sbu_id ) sub_sbu_name,p.architecture_type from tbl_project p left  join 	tbl_technology t  on p.project_id = t.project_id left join   tbl_domain d on  p.project_id = d.project_id where p.active = true and p.project_name like '%"+ projectName+"%'";
    
    if(clientName!=null && !clientName=="")
    {
      text = text + "and  p.client_name like '%"+clientName+"%'";
    }
    if(startDate!=null && !startDate=="")
    {
      text = text + "and  p.project_start_date >= '"+startDate+"'";
    }
    if(endDate!=null && !endDate=="")
    {
      text = text + "and  p.project_end_date <= '"+endDate+"'";
    }
    if(projectValueFrom!=null && !projectValueFrom=="")
    {
      text = text + "and  p.project_value >= '"+projectValueFrom+"'";
    }
    if(projectValueTo!=null && !projectValueTo=="")
    {
      text = text + "and  p.project_value <= '"+projectValueTo+"'";
    }
    if(region!=null && !region=="")
    {
      text = text + "and  p.region_id = '"+region+"'";
    }
    if(architectureType!=null && !architectureType=="")
    {
      text = text + "and  p.architecture_type like '%"+architectureType+"%'";
    }
    if(technology!=null && !technology=="")
    {
      let technologiesAray = null;
      console.log("tech array before:::"+technology);
      for(var j=0;j<technology.length;j++)
      {
        console.log("tech array before:::"+technologiesAray)
        if(technologiesAray!=null  && !technologiesAray=="")
        {
        technologiesAray = technologiesAray +","+ technology[j];
        }else{
          technologiesAray =  technology[j];
        }
      }
      console.log("tech array after:::"+technologiesAray)
      if(technologiesAray!=null)
      {
      text = text + "and t.technology_value_id in ( "+technologiesAray+")";
      }
    }
    if(domainName!=null && !domainName=="")
    {

      let domainAray = null;
      console.log("domainName array before:::"+domainName);
      for(var j=0;j<domainName.length;j++)
      {
        console.log("domainName array before:::"+domainAray)
        if(domainAray!=null  && !domainAray=="")
        {
          domainAray = domainAray +","+ domainName[j];
        }else{
          domainAray =  domainName[j];
        }
      }
      console.log("domainAray array after:::"+domainAray)
      if(domainAray!=null)
      {
      text = text + "and t.domain_value_id in ( "+domainAray+")";
      }
    
    }

      let sqlQuery = text;
      console.log("sqlQuery"+sqlQuery);
      /* if (gender != null) {
        sqlQuery = sqlQuery + " join tbl_master_data_value mdv on mdv.value_id = a.gender join tbl_master_data_key mdk on mdk.key_id = mdv.key_id and mdk.Key_code = 'GENDER' and mdv.value_code='GENDER_" + gender + "'";

      }

      sqlQuery = sqlQuery + " where a.active = true "

 */
      //console.log(sqlQuery);
      let projectData = [];
      db.query(sqlQuery, async (err, dbRes) => {
        if (err) {
          console.log(err.stack);
          let response = {
            SuccessStatus: successStatus,
            ErrorMessage: err.stack
          };
          res.json(response);
        } else {
          projectData =
            dbRes.rows && !isEmpty(dbRes.rows)
            ? await mergeProjectDataResults(
              dbRes.rows,
              request.query,
              request.body
            )
            : [];

          successStatus = true;

          let response = {
            ProjectData: projectData,
            SuccessStatus: successStatus
          };
          res.json(response);
        }
      });

    })
  );
  return api;
};
