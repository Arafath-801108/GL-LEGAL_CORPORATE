using AsirvadLegalModule.Core.BLL;
using AsirvadLegalModule.Core.BLL.Login;
using AsirvadLegalModule.Core.DataSource;
using AsirvadLegalModule.Core.DataSource.Login;
using AsirvadLegalModule.DTO.ChequeCollection.Request;
using AsirvadLegalModule.DTO.ChequeCollection.Response;
using AsirvadLegalModule.DTO.GoldSuitFIle.Request;
using AsirvadLegalModule.DTO.GoldSuitFIle.Response;
using AsirvadLegalModule.DTO.LegalNotice.Request;
using AsirvadLegalModule.DTO.LegalNotice.Response;
using AsirvadLegalModule.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;
using static AsirvadLegalModule.Utilities.Encrypt_Decrypt;

namespace AsirvadLegalModule.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]

    public class GoldSuitFIleController : ControllerBase
    {

        [HttpPost("GetCurrentBranch")]
        public async Task<ActionResult<string>> GetCurrentBranch(GetcurrentbranchRequest request)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    request.branch=  Encrypt_Decrypt.RSA.Decrypt(request.branch);
                    string encryptedResponse = await GoldSuitFIleBLL.Instance.GetCurrentBranch(request);

                    return Ok(encryptedResponse);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal Server Error: {ex.Message}");
                }
            }
            else
            {
                return BadRequest(ModelState);
            }
        }

        //------------------------------------------------------------------------------------------------------------------------
        [HttpPost("ComplaintType")]
        public async Task<ActionResult<string>> ComplaintType()
        {
            if (ModelState.IsValid)
            {
                try
                {
                    string encryptedResponse = await GoldSuitFIleBLL.Instance.SuitClassify();

                    return Ok(encryptedResponse);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal Server Error: {ex.Message}");
                }
            }
            else
            {
                return BadRequest(ModelState);
            }
        }
        [HttpPost("GetTimeLinetype")]

        public async Task<ActionResult<string>> GetTimeLinetype([FromBody] GoldSuitFIleRequest request)
        {
            if (ModelState.IsValid)
            {
                TImeLineResponse response = new TImeLineResponse();
                try
                {
                    request.cmpType = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.cmpType);
                    response.cmpTime = Aes_Handler.Encrypt(await GoldSuitFIleBLL.Instance.GetTimeLinetype(request)).Result;

                    return Ok(response.cmpTime);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal Server Error: {ex.Message}");
                }
            }
            else
            {
                return BadRequest(ModelState);
            }
        }

        //------------------------------------------------------------------------------------------------------------------------
        [HttpPost("GetPledgeList")]

        public async Task<ActionResult<string>> GetPledgeList([FromBody] GetPledgeRequset request)
        {
            request.plno = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.plno);

            request.branchId = Encrypt_Decrypt.RSA.Decrypt(request.branchId);
            request.employeeId = Encrypt_Decrypt.RSA.Decrypt(request.employeeId);
            if (ModelState.IsValid)
            {
                GetPledgeResponse response = new GetPledgeResponse();
                try
                {

                    string encryptedResponse = await GoldSuitFIleBLL.Instance.GetPledgeList(request);


                    return Ok(encryptedResponse);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal Server Error: {ex.Message}");
                }
            }
            else
            {
                return BadRequest(ModelState);
            }
        }
        //------------------------------------------------------------------------------------------------------------------------
        [HttpPost("GetSuitFileSubmit")]
        public async Task<ActionResult<string>> GetSuitFileSubmit([FromBody] GetSubmitRequset request)
        {
            request.complaint = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.complaint);
            request.caseType = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.caseType);
            request.Complaintval = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.Complaintval);
            request.police = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.police);
            request.anoBranch = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.anoBranch);
            request.curBranch = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.curBranch);
            request.goldInPlace = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.goldInPlace);
            request.reason = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.reason);
            request.prevPledge = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.prevPledge);
            request.goldInBranch = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.goldInBranch);
            request.pledgeList = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.pledgeList);
            request.flag1 = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.flag1);
            request.rm_cmt = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.rm_cmt);
            //request.doc = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.doc);
            request.docname = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.docname);
            request.flag2 = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.flag2);
            request.branchId = Encrypt_Decrypt.RSA.Decrypt(request.branchId);
            request.employeeId = Encrypt_Decrypt.RSA.Decrypt(request.employeeId);


            if (ModelState.IsValid)
            {
                GetSuitfileResponse response = new GetSuitfileResponse();
                try
                {

                    string encryptedResponse = await GoldSuitFIleBLL.Instance.GetSuitFileSubmit(request);


                    return Ok(encryptedResponse);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal Server Error: {ex.Message}");
                }
            }
            else
            {
                return BadRequest(ModelState);
            }
        }
        //------------------------------------------------------------------------------------------------------------------------

        [HttpPost("getPostCheck")]
        public async Task<ActionResult<string>> getPostCheck([FromBody] GetPostRequest request)
        {


            request.employeeId = Encrypt_Decrypt.RSA.Decrypt(request.employeeId);


            if (ModelState.IsValid)
            {
                GetPostReponse response = new GetPostReponse();
                try
                {

                    string encryptedResponse = await GoldSuitFIleBLL.Instance.getPostCheck(request);


                    return Ok(encryptedResponse);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal Server Error: {ex.Message}");
                }
            }
            else
            {
                return BadRequest(ModelState);
            }
        }
        //------------------------------------------------------------------------------------------------------------------------

        [HttpPost("getBranchCheck")]
        public async Task<ActionResult<string>> getBranchCheck([FromBody] GetBranchCheckRequest request)
        {


            request.branch = Encrypt_Decrypt.RSA.Decrypt(request.branch);
            request.post = Encrypt_Decrypt.RSA.Decrypt(request.post);


            if (ModelState.IsValid)
            {
                GetBranchResponse response = new GetBranchResponse();
                try
                {

                    string encryptedResponse = await GoldSuitFIleBLL.Instance.GetBranchCheck(request);


                    return Ok(encryptedResponse);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal Server Error: {ex.Message}");
                }
            }
            else
            {
                return BadRequest(ModelState);
            }
        }
        //------------------------------------------------------------------------------------------------------------------------

        [HttpPost("GetComplaintCheck")]
        public async Task<ActionResult<string>> GetComplaintCheck([FromBody] GetComplaintCheckReq request)
        {

            request.branch = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.branch);
            //request.branch = Encrypt_Decrypt.RSA.Decrypt(request.branch);
            request.post = Encrypt_Decrypt.RSA.Decrypt(request.post);


            if (ModelState.IsValid)
            {
                GetComplaintResponse response = new GetComplaintResponse();
                try
                {

                    string encryptedResponse = await GoldSuitFIleBLL.Instance.GetComplaintCheck(request);


                    return Ok(encryptedResponse);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal Server Error: {ex.Message}");
                }
            }
            else
            {
                return BadRequest(ModelState);
            }
        }
        //------------------------------------------------------------------------------------------------------------------------

        [HttpPost("GetCaseDetails")]
        public async Task<ActionResult<string>> GetCaseDetails([FromBody] getLegalDetailsRequest request)
        {



            request.legal = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.legal);


            if (ModelState.IsValid)
            {
                getLegalDetailsResponse response = new getLegalDetailsResponse();
                try
                {

                    string encryptedResponse = await GoldSuitFIleBLL.Instance.GetCaseDetails(request);


                    return Ok(encryptedResponse);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal Server Error: {ex.Message}");
                }
            }
            else
            {
                return BadRequest(ModelState);
            }
        }
        //----------------------------------------------------------------------------------------------------------------------------

        [HttpPost("GetPledgeShowDetail")]
        public async Task<ActionResult<string>> GetPledgeShowDetail([FromBody] getLegalDetailsRequest request)
        {



            request.legal = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.legal);


            if (ModelState.IsValid)
            {
                getPledgeListResponse response = new getPledgeListResponse();
                try
                {

                    string encryptedResponse = await GoldSuitFIleBLL.Instance.GetPledgeShowDetail(request);


                    return Ok(encryptedResponse);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal Server Error: {ex.Message}");
                }
            }
            else
            {
                return BadRequest(ModelState);
            }
        }

        //------------------------------------------------------------------------------------------------------------------------
        [HttpPost("GetSuitFileApprove")]
        public async Task<ActionResult<string>> GetSuitFileApprove([FromBody] GetSubmitRequset request)
        {
            request.complaint = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.complaint);
            request.caseType = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.caseType);
            request.Complaintval = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.Complaintval);
            request.police = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.police);
            request.anoBranch = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.anoBranch);
            request.curBranch = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.curBranch);
            request.goldInPlace = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.goldInPlace);
            request.reason = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.reason);
            request.prevPledge = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.prevPledge);
            request.goldInBranch = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.goldInBranch);
            request.pledgeList = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.pledgeList);
            request.flag1 = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.flag1);
            request.rm_cmt = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.rm_cmt);
            request.branchId = Encrypt_Decrypt.RSA.Decrypt(request.branchId);
            request.employeeId = Encrypt_Decrypt.RSA.Decrypt(request.employeeId);
            request.flag2 = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.flag2);



            if (ModelState.IsValid)
            {
                GetSuitfileResponse response = new GetSuitfileResponse();
                try
                {

                    string encryptedResponse = await GoldSuitFIleBLL.Instance.GetSuitFileApprove(request);


                    return Ok(encryptedResponse);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal Server Error: {ex.Message}");
                }
            }
            else
            {
                return BadRequest(ModelState);
            }
        }

        [HttpPost("LegalSuitFileSelect")]
        public async Task<ActionResult<string>> LegalSuitFileSelect(GetSuitFileDeatailsRequset request)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    string encryptedResponse = await GoldSuitFIleBLL.Instance.LegalSuitFileSelect(request);

                    return Ok(encryptedResponse);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal Server Error: {ex.Message}");
                }
            }
            else
            {
                return BadRequest(ModelState);
            }
        }
        [HttpPost("LegalConfirmDetails")]
        public async Task<ActionResult<string>> LegalConfirmDetails(GetSuitFileDeatailsRequset request)
        {
            request.p_indata = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.p_indata);
            request.as_optflag = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.as_optflag);

            if (ModelState.IsValid)
            {
                try
                {
                    string encryptedResponse = await GoldSuitFIleBLL.Instance.LegalConfirmDetails(request);

                    return Ok(encryptedResponse);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal Server Error: {ex.Message}");
                }
            }
            else
            {
                return BadRequest(ModelState);
            }
        }
        [HttpPost("plp_Legal_Select")]
        public async Task<ActionResult<string>> plp_Legal_Select(GetSuitFileDeatailsRequset request)
        {
            request.p_indata = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.p_indata);
            request.as_optflag = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.as_optflag);
            request.branch = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.branch);

            if (ModelState.IsValid)
            {
                try
                {
                    string encryptedResponse = await GoldSuitFIleBLL.Instance.plp_Legal_Select(request);

                    return Ok(encryptedResponse);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal Server Error: {ex.Message}");
                }
            }
            else
            {
                return BadRequest(ModelState);
            }
        }
        [HttpPost("PdfUpload1")]
        public async Task<ActionResult<string>> PdfUpload1([FromBody] GetSuitFileDocumentRequest request)
        {
            request.indata = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.indata);

            if (ModelState.IsValid)
            {
                GetSuitFilepdfResponse response = new GetSuitFilepdfResponse();
                try
                {

                    string encryptedResponse = await GoldSuitFIleBLL.Instance.PdfUpload1(request);


                    return Ok(encryptedResponse);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal Server Error: {ex.Message}");
                }
            }
            else
            {
                return BadRequest(ModelState);
            }
        }
        [HttpPost("Suitfile_doc")]
        public async Task<ActionResult<string>> Suitfile_doc([FromBody] Suitfile_docRequest request)
        {


            if (ModelState.IsValid)
            {

                request.empId = Encrypt_Decrypt.RSA.Decrypt(request.empId);
                request.indata = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.indata);
                request.flag = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.flag);
                //request.Encrypted_data = Encrypt_Decrypt.RSA.Decrypt(request.Encrypted_data);






                string[] segments = request.encrypt_data.Split('~');

                // Decrypt each segment and store the results
                List<string> decryptedSegments = new List<string>();
                foreach (string segment in segments)
                {
                    decryptedSegments.Add(Encrypt_Decrypt.RSA.Decrypt(segment)); // Assuming Decrypt is a defined method
                }

                // Join the decrypted values back into a single result
                request.encrypt_data = string.Join("~", decryptedSegments);

                Suitfile_docResponse response = new Suitfile_docResponse();
                try
                {

                    string encryptedResponse = await GoldSuitFIleBLL.Instance.Suitfile_doc(request);


                    return Ok(encryptedResponse);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal Server Error: {ex.Message}");
                }
            }
            else
            {
                return BadRequest(ModelState);
            }

        }


        [HttpPost("pdf_view")]
        public async Task<ActionResult<string>> pdfview([FromBody] Suitfile_docRequest request)
        {
            request.indata = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.indata);

            //request.branchId = Encrypt_Decrypt.RSA.Decrypt(request.branchId);

            request.flag = await Encrypt_Decrypt.Aes_Handler.Decrypt(request.flag);
            if (ModelState.IsValid)
            {
                Suitfile_docResponse response = new Suitfile_docResponse();
                try
                {

                    string encryptedResponse = await GoldSuitFIleBLL.Instance.pdf_view(request);


                    return Ok(encryptedResponse);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal Server Error: {ex.Message}");
                }
            }
            else
            {
                return BadRequest(ModelState);
            }
        }
    }
}
