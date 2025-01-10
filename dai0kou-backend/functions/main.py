def hello_world(request):
    """
    HTTP Cloud Function.
    Args:
        request (flask.Request): The request object.
    Returns:
        A response with a greeting message.
    """
    return "Hello, World from Python Cloud Function!"
