from rest_framework.renderers import JSONRenderer
import json

class ApiRenderer(JSONRenderer):
    charset='utf-8'
    def render(self, data, accepted_media_type=None, renderer_context=None):
        if 'ErrorDetail' in str(data):
            return super().render({'error_message': data}, accepted_media_type, renderer_context)
        else:
            return super().render({'data': data}, accepted_media_type, renderer_context)