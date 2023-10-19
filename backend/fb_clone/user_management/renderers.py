from rest_framework.renderers import JSONRenderer
import json

class ApiRenderer(JSONRenderer):
    charset='utf-8'
    def render(self, data, accepted_media_type=None, renderer_context=None):
        return json.dumps({"error":data}) if "ErrorDetail" in str(data) else json.dumps(data)