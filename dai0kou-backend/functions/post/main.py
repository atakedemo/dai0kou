import lib.prompt as prompt
import lib.post as post
from flask import jsonify
import json

def post_blog(request):
    body = request.get_json()
    
    # Get setting json (from DB)
    setting = {
        "media": "Zenn",
        "thema": [
            "https://",
            "dsfadsfadsfdsa",
        ],
        "additional": "日本国内の銀行業界に与える影響"
    }

    # Get Status
    status = {
        "stage": 3,
        "digest": "XXXXXX"
    }

    if status["stage"] == 1:
        print('now 1')
        contents = "222"
        return jsonify({"message": "Hello, world!"})
    
    elif status["stage"] > 1:
        print('now 2~')
        digest = status["digest"]
        
        # thema = """
        # This specification defines an OAuth-protected API for the issuance of Verifiable Credentials. Credentials can be of any format, including, but not limited to, IETF SD-JWT VC [I-D.ietf-oauth-sd-jwt-vc], ISO mDL [ISO.18013-5], and W3C VCDM [VC_DATA].
        # Verifiable Credentials are very similar to identity assertions, like ID Tokens in OpenID Connect [OpenID.Core], in that they allow a Credential Issuer to assert End-User claims. A Verifiable Credential follows a pre-defined schema (the Credential type) and MAY be bound to a certain holder, e.g., through Cryptographic Holder Binding. Verifiable Credentials can be securely presented for the End-User to the RP, without involvement of the Credential Issuer.
        # Access to this API is authorized using OAuth 2.0 [RFC6749], i.e., the Wallet uses OAuth 2.0 to obtain authorization to receive Verifiable Credentials. This way the issuance process can benefit from the proven security, simplicity, and flexibility of OAuth 2.0 and existing OAuth 2.0 deployments and OpenID Connect OPs (see [OpenID.Core]) can be extended to become Credential Issuers.
        # """
        thema = "https://www.aamva.org/getmedia/8d8fbb1f-1ec0-4b25-89a1-b90c36163edb/mdl-implementation-guidelines-v1-4.pdf"
        
        # Generate Contents
        if thema.startswith('https://'):
            content = prompt.generateContentsFromPdf(
                thema, 
                setting["additional"], 
                status["stage"], 
                digest
            )
        else:
            content = prompt.generateContents(
                thema, 
                setting["additional"], 
                status["stage"], 
                digest
            )

        # Post Content (Zenn or X or ...)
        post_result = post.post_zenn(
            body['accessToken'],
            'atakedemo',
            'zenn-doc-bamb00',
            'main',
            'articles/README.md',
            content,
            'Test on GCP'
        )

        # return jsonify({"contents": contents})
        
        return jsonify({"message": content})

    return jsonify({"message": "Failed..."})