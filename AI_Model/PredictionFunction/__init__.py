import datetime
import logging

import azure.functions as func
from AI_Model.main import run_prediction


def main(mytimer: func.TimerRequest) -> None:
    utc_timestamp = datetime.datetime.utcnow().replace(
        tzinfo=datetime.timezone.utc).isoformat()

    if mytimer.past_due:
        logging.info('The timer is past due!')

    run_prediction()
    logging.info('Python timer trigger function ran at %s', utc_timestamp)
