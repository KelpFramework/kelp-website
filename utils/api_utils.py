"""
This file is used for the simple Rest API calls made by the backend.
Generally, the Flask backend communicates with the frontend directly
by passing the required data to the HTML file when the corresponding
route is loaded, but some data is retrieved from the JS frontend directly.

This file makes is easier to create API responses to those calls.
"""

from __init__ import make_response, StopCodes


def craft_response(data, status_code, **kwargs):
    ret_data = {"data": data, "status": status_code}
    for arg in kwargs:
        ret_data[arg] = kwargs[arg]
    ret = make_response(ret_data, status_code)
    ret.headers["Content-Type"] = "application/json"
    return ret


def craft_complex_response(data: list, status_code, **kwargs):
    ret_data = {"status": status_code}
    for dat in data:
        ret_data[dat] = data[dat]
    for arg in kwargs:
        ret_data[arg] = kwargs[arg]
    ret = make_response(ret_data, status_code)
    ret.headers["Content-Type"] = "application/json"
    return ret


def craft_boolean_response(boolean: bool, error_code=StopCodes.ServerError.InternalServerError, **kwargs):
    ret_data = {"state": boolean, "status": 200 if boolean else error_code}
    for arg in kwargs:
        ret_data[arg] = kwargs[arg]
    ret = make_response(ret_data, 200 if boolean else error_code)
    ret.headers["Content-Type"] = "application/json"
    return ret


def empty_success():
    return make_response({}, StopCodes.Success.NoContent)
