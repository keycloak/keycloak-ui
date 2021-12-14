import React, { useState } from "react";
import { Link, useHistory, useParams, useRouteMatch } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Controller, FormProvider, useForm } from "react-hook-form";
import {
  ActionGroup,
  AlertVariant,
  Button,
  ButtonVariant,
  Checkbox,
  DropdownItem,
  FormGroup,
  Grid,
  GridItem,
  InputGroup,
  PageSection,
  TextInput,
  ValidatedOptions,
} from "@patternfly/react-core";
import type ProtocolMapperRepresentation from "@keycloak/keycloak-admin-client/lib/defs/protocolMapperRepresentation";
import type { ProtocolMapperTypeRepresentation } from "@keycloak/keycloak-admin-client/lib/defs/serverInfoRepesentation";

import { ViewHeader } from "../../components/view-header/ViewHeader";
import { useAdminClient, useFetch } from "../../context/auth/AdminClient";
import { useConfirmDialog } from "../../components/confirm-dialog/ConfirmDialog";
import { useAlerts } from "../../components/alert/Alerts";
import { HelpItem } from "../../components/help-enabler/HelpItem";
import { useServerInfo } from "../../context/server-info/ServerInfoProvider";
import { convertFormValuesToObject, convertToFormValues } from "../../util";
import { FormAccess } from "../../components/form-access/FormAccess";
import { useRealm } from "../../context/realm-context/RealmContext";
import { MapperParams, MapperRoute } from "../routes/Mapper";
import { toClientScope } from "../routes/ClientScope";
import { DynamicComponents } from "../../components/dynamic/DynamicComponents";

import "./mapping-details.css";

export default function MappingDetails() {
  const { t } = useTranslation("client-scopes");
  const adminClient = useAdminClient();
  const { addAlert, addError } = useAlerts();

  const { id, mapperId, type } = useParams<MapperParams>();
  const form = useForm();
  const { register, setValue, errors, handleSubmit } = form;
  const [mapping, setMapping] = useState<ProtocolMapperTypeRepresentation>();
  const [config, setConfig] =
    useState<{ protocol?: string; protocolMapper?: string }>();

  const history = useHistory();
  const { realm } = useRealm();
  const serverInfo = useServerInfo();
  const isGuid = /^[{]?[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}[}]?$/;
  const isUpdating = !!mapperId.match(isGuid);

  const isOnClientScope = !!useRouteMatch(MapperRoute.path);
  const toDetails = () =>
    isOnClientScope
      ? toClientScope({ realm, id, type: type!, tab: "mappers" })
      : `/${realm}/clients/${id}/mappers`;

  useFetch(
    async () => {
      let data: ProtocolMapperRepresentation | undefined;
      if (isUpdating) {
        if (isOnClientScope) {
          data = await adminClient.clientScopes.findProtocolMapper({
            id,
            mapperId,
          });
        } else {
          data = await adminClient.clients.findProtocolMapperById({
            id,
            mapperId,
          });
        }
        if (!data) {
          throw new Error(t("common:notFound"));
        }

        const mapperTypes = serverInfo.protocolMapperTypes![data!.protocol!];
        const mapping = mapperTypes.find(
          (type) => type.id === data!.protocolMapper
        );

        return {
          config: {
            protocol: data.protocol,
            protocolMapper: data.protocolMapper,
          },
          mapping,
          data,
        };
      } else {
        const model = type
          ? await adminClient.clientScopes.findOne({ id })
          : await adminClient.clients.findOne({ id });
        if (!model) {
          throw new Error(t("common:notFound"));
        }
        const protocolMappers =
          serverInfo.protocolMapperTypes![model.protocol!];
        const mapping = protocolMappers.find(
          (mapper) => mapper.id === mapperId
        );
        if (!mapping) {
          throw new Error(t("common:notFound"));
        }
        return {
          mapping,
          config: {
            protocol: model.protocol,
            protocolMapper: mapperId,
          },
        };
      }
    },
    ({ config, mapping, data }) => {
      setConfig(config);
      setMapping(mapping);
      if (data) {
        convertToFormValues(data, setValue);
      }
    },
    []
  );

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: "common:deleteMappingTitle",
    messageKey: "common:deleteMappingConfirm",
    continueButtonLabel: "common:delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        if (isOnClientScope) {
          await adminClient.clientScopes.delProtocolMapper({
            id,
            mapperId,
          });
        } else {
          await adminClient.clients.delProtocolMapper({
            id,
            mapperId,
          });
        }
        addAlert(t("common:mappingDeletedSuccess"), AlertVariant.success);
        history.push(toDetails());
      } catch (error) {
        addError("common:mappingDeletedError", error);
      }
    },
  });

  const save = async (formMapping: ProtocolMapperRepresentation) => {
    const key = isUpdating ? "Updated" : "Created";
    try {
      const mapping = { ...config, ...convertFormValuesToObject(formMapping) };
      if (isUpdating) {
        isOnClientScope
          ? await adminClient.clientScopes.updateProtocolMapper(
              { id, mapperId },
              { id: mapperId, ...mapping }
            )
          : await adminClient.clients.updateProtocolMapper(
              { id, mapperId },
              { id: mapperId, ...mapping }
            );
      } else {
        isOnClientScope
          ? await adminClient.clientScopes.addProtocolMapper({ id }, mapping)
          : await adminClient.clients.addProtocolMapper({ id }, mapping);
      }
      addAlert(t(`common:mapping${key}Success`), AlertVariant.success);
    } catch (error) {
      addError(`common:mapping${key}Error`, error);
    }
  };

  return (
    <>
      <DeleteConfirm />
      <ViewHeader
        titleKey={isUpdating ? mapping?.name! : t("common:addMapper")}
        subKey={isUpdating ? mapperId : "client-scopes:addMapperExplain"}
        dropdownItems={
          isUpdating
            ? [
                <DropdownItem
                  key="delete"
                  value="delete"
                  onClick={toggleDeleteDialog}
                >
                  {t("common:delete")}
                </DropdownItem>,
              ]
            : undefined
        }
      />
      <PageSection variant="light">
        <FormAccess
          isHorizontal
          onSubmit={handleSubmit(save)}
          role="manage-clients"
          className="keycloak__client-scope-mapping-details__form"
        >
          <FormGroup label={t("common:mapperType")} fieldId="mapperType">
            <TextInput
              type="text"
              id="mapperType"
              name="mapperType"
              isReadOnly
              value={mapping?.name}
            />
          </FormGroup>
          <FormGroup
            label={t("common:name")}
            labelIcon={
              <HelpItem
                helpText="client-scopes-help:mapperName"
                fieldLabelId="name"
              />
            }
            fieldId="name"
            isRequired
            validated={
              errors.name ? ValidatedOptions.error : ValidatedOptions.default
            }
            helperTextInvalid={t("common:required")}
          >
            <TextInput
              ref={register({ required: true })}
              type="text"
              id="name"
              name="name"
              isReadOnly={isUpdating}
              validated={
                errors.name ? ValidatedOptions.error : ValidatedOptions.default
              }
            />
          </FormGroup>
          <FormProvider {...form}>
            {mapping?.id === "oidc-address-mapper" ? (
              <>
                <FormGroup hasNoPaddingTop label={t("addTo")} fieldId="kc-flow">
                  <Grid>
                    <GridItem lg={3} sm={3}>
                      <Controller
                        name="config.id.token.claim"
                        defaultValue={false}
                        control={form.control}
                        render={({ onChange, value }) => (
                          <InputGroup>
                            <Checkbox
                              data-testid={`dynamic:${mapping.properties[0].label}`}
                              label={t(
                                `dynamic:${mapping.properties[0].label}`
                              )}
                              id="kc-ID-token-check"
                              name="config.id.token.claim"
                              isChecked={eval(value)}
                              onChange={onChange}
                            />
                            <HelpItem
                              helpText={t(
                                `dynamic:${mapping.properties[0].helpText}`
                              )}
                              forLabel={t(
                                `dynamic:${mapping.properties[0].label}`
                              )}
                              forID={t(`common:helpLabel`, {
                                label: t(
                                  `dynamic:${mapping.properties[0].label}`
                                ),
                              })}
                            />
                          </InputGroup>
                        )}
                      />
                    </GridItem>
                    <GridItem lg={4} sm={3}>
                      <Controller
                        name="config.access.token.claim"
                        defaultValue={false}
                        control={form.control}
                        render={({ onChange, value }) => (
                          <InputGroup>
                            <Checkbox
                              data-testid={`dynamic:${mapping.properties[1].label}`}
                              label={t(
                                `dynamic:${mapping.properties[1].label}`
                              )}
                              id="kc-access-token-check"
                              name={mapping.properties[1].name}
                              isChecked={eval(value)}
                              onChange={onChange}
                            />
                            <HelpItem
                              helpText={t(
                                `dynamic:${mapping.properties[1].helpText}`
                              )}
                              forLabel={t(
                                `dynamic:${mapping.properties[1].label}`
                              )}
                              forID={t(`common:helpLabel`, {
                                label: t(
                                  `dynamic:${mapping.properties[1].label}`
                                ),
                              })}
                            />
                          </InputGroup>
                        )}
                      />
                    </GridItem>
                    <GridItem lg={3} sm={3}>
                      <Controller
                        name="config.userinfo.token.claim"
                        defaultValue={false}
                        control={form.control}
                        render={({ onChange, value }) => (
                          <InputGroup>
                            <Checkbox
                              data-testid={`dynamic:${mapping.properties[2].label}`}
                              label={t(
                                `dynamic:${mapping.properties[2].label}`
                              )}
                              id="kc-access-token-check"
                              name={mapping.properties[2].name}
                              isChecked={eval(value)}
                              onChange={onChange}
                            />
                            <HelpItem
                              helpText={t(
                                `dynamic:${mapping.properties[2].helpText}`
                              )}
                              forLabel={t(
                                `dynamic:${mapping.properties[2].label}`
                              )}
                              forID={t(`common:helpLabel`, {
                                label: t(
                                  `dynamic:${mapping.properties[2].label}`
                                ),
                              })}
                            />
                          </InputGroup>
                        )}
                      />
                    </GridItem>
                  </Grid>
                </FormGroup>
                <DynamicComponents
                  properties={mapping.properties.slice(
                    3,
                    mapping.properties.length - 1
                  )}
                />
              </>
            ) : (
              <DynamicComponents properties={mapping?.properties || []} />
            )}
          </FormProvider>
          <ActionGroup>
            <Button variant="primary" type="submit">
              {t("common:save")}
            </Button>
            <Button
              variant="link"
              component={(props) => <Link {...props} to={toDetails()} />}
            >
              {t("common:cancel")}
            </Button>
          </ActionGroup>
        </FormAccess>
      </PageSection>
    </>
  );
}
