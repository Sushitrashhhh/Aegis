import os
import json
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger("cyra_sentinel.services.s3")

class S3ForensicStorage:
    """AWS S3 Forensic Storage Service for archiving incident telemetry and evidence artifacts."""

    def __init__(self):
        self.region = os.getenv("AWS_REGION", "us-east-1")
        self.bucket_name = os.getenv("S3_BUCKET_NAME", os.getenv("AWS_S3_BUCKET", ""))
        self.s3_client = None

        if self.bucket_name and os.getenv("AWS_ACCESS_KEY_ID") and os.getenv("AWS_SECRET_ACCESS_KEY"):
            try:
                import boto3
                self.s3_client = boto3.client(
                    "s3",
                    region_name=self.region,
                    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
                    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
                )
                logger.info(f"S3 client initialized with bucket '{self.bucket_name}' in region '{self.region}'")
            except Exception as e:
                logger.warning(f"Failed to initialize S3 client: {e}")

    def archive_incident_evidence(self, incident_id: str, payload: Dict[str, Any]) -> Optional[str]:
        """Uploads incident forensic JSON payload to S3 if configured."""
        if not self.s3_client or not self.bucket_name:
            return None

        key = f"forensics/incidents/{incident_id}/evidence.json"
        try:
            body = json.dumps(payload, indent=2, default=str)
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=key,
                Body=body.encode("utf-8"),
                ContentType="application/json"
            )
            s3_uri = f"s3://{self.bucket_name}/{key}"
            logger.info(f"Archived incident evidence to {s3_uri}")
            return s3_uri
        except Exception as e:
            logger.error(f"Failed to upload evidence to S3 ({key}): {e}")
            return None

s3_storage = S3ForensicStorage()
