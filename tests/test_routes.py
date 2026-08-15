import unittest

from nycproject.app import app


class RouteSmokeTests(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    def test_html_routes_load(self):
        routes = [
            "/",
            "/dash/",
            "/boroughcomp/",
            "/scope/",
            "/heatmap/",
            "/top10/",
            "/contrib/",
            "/retrieval/",
            "/clusters/",
            "/team/",
            "/testing/",
            "/sunburst/",
        ]

        for route in routes:
            with self.subTest(route=route):
                response = self.client.get(route)
                self.assertEqual(response.status_code, 200)

    def test_json_routes_load(self):
        routes = [
            "/geojson/",
            "/map-crashes/?decimals=2",
            "/heatmap-points/",
            "/heatmap-points/?scope=top10",
            "/heatmap-points/?scope=top10&month=2025-01",
            "/heatmap-points/?scope=all&month=2025-01",
            "/bounds/",
            "/datafile1/",
            "/borough/",
            "/borough/queens/",
            "/events/queens/",
            "/summary/queens/",
            "/summary/statenisland/",
            "/topten/",
            "/factors/",
            "/totals_boroughs/",
        ]

        for route in routes:
            with self.subTest(route=route):
                response = self.client.get(route)
                self.assertEqual(response.status_code, 200)
                self.assertTrue(response.content_type.startswith("application/json"))


if __name__ == "__main__":
    unittest.main()
