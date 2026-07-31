from typing import List
from sensor.schema import SensorEvent

def generate_ransomware_events(device_id: str = "DEV-DB-SRV-02") -> List[SensorEvent]:
    return [
        SensorEvent(
            device_id=device_id,
            device_name="db-cluster-node-02",
            event_type="process_execution",
            process_name="vssadmin.exe",
            process_id=8812,
            parent_process="powershell.exe",
            user="NT AUTHORITY\\SYSTEM",
            command_line="vssadmin delete shadows /all /quiet",
            details={"shadow_copy_deleted": True}
        ),
        SensorEvent(
            device_id=device_id,
            device_name="db-cluster-node-02",
            event_type="file_modification",
            process_name="encrypter.exe",
            process_id=9012,
            parent_process="powershell.exe",
            user="NT AUTHORITY\\SYSTEM",
            file_path="C:\\Data\\FinancialRecords.db.locked",
            command_line="encrypter.exe --dir C:\\Data --key x8f9a2",
            details={"files_modified_count": 450, "entropy": 7.98}
        )
    ]
