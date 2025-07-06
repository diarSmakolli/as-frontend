import { Box, Text, VStack, Flex, Switch, Select } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { usePreferences } from "../../authContext/preferencesProvider";
import AdministrationCustomSelect from '../../components/settings/CustomSelect';

const PreferencesSettingsTab = () => {
    const {
        autoTimezone,
        setAutoTimezone,
        manualTimezone,
        setManualTimezone,
        currentTimezone,
    } = usePreferences();

    const [timezones, setTimezones] = useState([]);

    useEffect(() => {
        const zones = Intl.supportedValuesOf("timeZone").map((zone) => {
            const date = new Date();
            const timeZoneOffset = new Intl.DateTimeFormat("en-US", {
                timeZone: zone,
                timeZoneName: "shortOffset",
            }).formatToParts(date).find((part) => part.type === "timeZoneName")?.value || "";
            return {
                value: zone,
                label: `(${timeZoneOffset}) ${zone.replace(/_/g, " ")}`,
            };
        });
        zones.sort((a, b) => {
            const offsetA = a.label.match(/\((GMT[+-]\d{1,2}(:\d{2})?)\)/)?.[1] || "";
            const offsetB = b.label.match(/\((GMT[+-]\d{1,2}(:\d{2})?)\)/)?.[1] || "";
            return offsetA.localeCompare(offsetB);
        });
        setTimezones(zones);
    }, []);

    return (
      <Box flex={1} overflowY="auto" pr={2}>
        <Text fontSize="md" mb={4} fontFamily="Inter" color="gray.900">
          Preferences
        </Text>
        <Text fontFamily="Inter" color="gray.700" fontSize="sm" mb={6}>
          Customize your workspace experience.
        </Text>

        <Box>
          <Text
            fontSize="md"
            fontWeight="medium"
            color="gray.900"
            mb={4}
            fontFamily="Inter"
          >
            Time Settings
          </Text>
          <VStack
            spacing={6}
            align="stretch"
            bg="rgb(255,255,255)"
            p={4}
            borderRadius="lg"
            borderColor="gray.400"
            borderWidth={1}
          >
            <Flex justify="space-between" align="center">
              <Box>
                <Text fontSize="sm" color="gray.900" mb={1} fontFamily="Inter">
                  Set timezone automatically
                </Text>
                <Text fontSize="xs" color="gray.900" fontFamily="Inter">
                  Let the application detect your timezone automatically.
                </Text>
              </Box>
              <Switch
                size="md"
                colorScheme="gray"
                isChecked={autoTimezone}
                onChange={(e) => setAutoTimezone(e.target.checked)}
              />
            </Flex>
            <Flex justify="space-between" align="center">
              <Box>
                <Text fontSize="sm" color="gray.900" mb={1} fontFamily="Inter">
                  Timezone
                </Text>
                <Text fontSize="xs" color="gray.900" fontFamily="Inter">
                  Current effective timezone: {currentTimezone}
                </Text>
              </Box>
              {/* <AdministrationCustomSelect
                            value={manualTimezone}
                            onChange={setManualTimezone}
                            options={timezones}
                            isDisabled={autoTimezone}
                            placeholder="Select timezone manually"
                            width="300px"
                        /> */}
              <Select>
                {timezones.map((zone) => (
                  <option key={zone.value} value={zone.value}>
                    {zone.label}
                  </option>
                ))}
              </Select>
            </Flex>
          </VStack>
        </Box>
      </Box>
    );
};

export default PreferencesSettingsTab;