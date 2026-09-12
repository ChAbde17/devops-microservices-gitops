from prometheus_fastapi_instrumentator import Instrumentator

instrumentator = Instrumentator(
    should_group_status_codes=False,
    should_ignore_untemplated=True,
    should_respect_env_var=False,
    excluded_handlers=["/healthz", "/readyz", "/metrics"],
    inprogress_name="http_requests_inprogress",
    inprogress_labels=True,
)


def setup_metrics(app):
    """Instrument the FastAPI app and expose /metrics endpoint."""
    instrumentator.instrument(app).expose(app, endpoint="/metrics", include_in_schema=False)
