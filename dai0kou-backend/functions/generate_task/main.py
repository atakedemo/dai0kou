import json
import os
from typing import Optional
from cloudevents.http import CloudEvent
import functions_framework
from google.events.cloud import firestore
from google.cloud import tasks_v2


@functions_framework.cloud_event
def generate_task(cloud_event: CloudEvent) -> None:
    print('Triger by Firestore!!!')
    """Triggers by a change to a Firestore document.

    Args:
        cloud_event: cloud event with information on the firestore event trigger
    """
    firestore_payload = firestore.DocumentEventData()
    firestore_payload._pb.ParseFromString(cloud_event.data)

    # タスクを構成する
    client = tasks_v2.CloudTasksClient()
    
    PROJECT_ID = os.getenv("PROJECT_ID")
    CLOUD_RUN_URL = os.getenv("CLOUD_RUN_URL")
    TASK_QUEUE_NAME = os.getenv("TASK_QUEUE_NAME")
    
    project_url = firestore_payload.value.name
    
    contents = firestore_payload.value.fields["contents"].array_value
    print('start loop!!!')
    for i, content in enumerate(contents.values):
        print(content.map_value.fields["sub_title"].string_value)
    
        json_payload = {
            "text": f"これはテストです",
            "index": i,
            "project_url": project_url,
            # "body": content.map_value.fields["body"].string_value
        }
        
        task = tasks_v2.Task(
            http_request = tasks_v2.HttpRequest(
                http_method = tasks_v2.HttpMethod.POST,
                url = CLOUD_RUN_URL ,
                headers = {"Content-type": "application/json"},
                body = json.dumps(json_payload).encode()
            ),
        )

        # タスクをキューに送信する
        client.create_task(
            tasks_v2.CreateTaskRequest(
                parent = client.queue_path(
                    project = PROJECT_ID,
                    location = 'asia-northeast1',
                    queue = TASK_QUEUE_NAME
                ),
                task = task,
            )
        )
    print('Push task to que')
