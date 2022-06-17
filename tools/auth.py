"""
 Copyright 2022 Google LLC

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
"""
import google.auth
from google.auth.transport import requests


def get_credentials() -> tuple:
    """
      Fetches the credentials from the user / SA configured in
      gcloud tool
      RETURNS: Tuple with credentials object and project string the auth
      was granated for.
      """

    auth_req = requests.Request()

    # Credemtials will be scoped against all of cloud, but still subject
    # to IAM.
    creds, project = google.auth.default(
        scopes=['https://www.googleapis.com/auth/cloud-platform'])

    if creds is None:
        return None

    creds.refresh(auth_req)

    return creds, project
