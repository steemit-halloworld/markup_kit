<?xml version="1.0" encoding="utf-8"?>
<xsl:transform
        version="1.0"
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
        xmlns:exsl="http://exslt.org/common"
        xmlns:msxsl="urn:schemas-microsoft-com:xslt"
        xmlns:m="http://informatik.hu-berlin.de/merge"
        exclude-result-prefixes="exsl msxsl m">

    <xsl:import href="merge.xsl"/>

    <xsl:output method="html" encoding="utf-8" indent="yes"/>

    <msxsl:script language="JScript" implements-prefix="exsl">
        this['node-set'] = function (x) {
        return x;
        }
    </msxsl:script>

    <xsl:variable name="data" select="/html"/>

    <xsl:template name="m:merge-attributes">
        <xsl:param name="attrs1"/>
        <xsl:param name="attrs2"/>

        <xsl:call-template name="m:merge">
            <xsl:with-param name="nodes1" select="$attrs1"/>
            <xsl:with-param name="nodes2" select="$attrs2"/>
        </xsl:call-template>

    </xsl:template>

    <!-- Override standard merge behaviour: ignoring all attributes except id -->
    <xsl:template name="m:compare-nodes">
        <xsl:param name="node1"/>
        <xsl:param name="node2"/>
        <xsl:variable name="type1">
            <xsl:apply-templates mode="m:detect-type" select="$node1"/>
        </xsl:variable>
        <xsl:variable name="type2">
            <xsl:apply-templates mode="m:detect-type" select="$node2"/>
        </xsl:variable>

        <xsl:choose>
            <!-- Are $node1 and $node2 element nodes with the same name? -->
            <xsl:when test="$type1='element' and $type2='element' and
                         local-name($node1)=local-name($node2) and
                         namespace-uri($node1)=namespace-uri($node2) and
                         name($node1)!=$dontmerge and name($node2)!=$dontmerge">

                <!-- Comparing the attributes -->
                <xsl:variable name="diff-att">
                    <!--xsl:if test="count($node1/@id)!=count($node2/@id)">.</xsl:if-->
                    <!-- ... and same name/content -->
                    <xsl:for-each select="$node1/@id">
                        <xsl:if test="not($node2/@id
                        [local-name()=local-name(current()) and
                         string(.)=string(current())])">.
                        </xsl:if>
                    </xsl:for-each>
                </xsl:variable>

                <xsl:choose>
                    <xsl:when test="string-length($diff-att)!=0">!</xsl:when>
                    <xsl:otherwise>=</xsl:otherwise>
                </xsl:choose>
            </xsl:when>

            <!-- Other nodes: test for the same type and content -->
            <xsl:when test="$type1!='element' and $type1=$type2 and
                         name($node1)=name($node2) and
                         ($node1=$node2 or
                            ($normalize='yes' and
                             normalize-space($node1)=
                             normalize-space($node2)))">=
            </xsl:when>

            <!-- Otherwise: different node types or different name/content -->
            <xsl:otherwise>!</xsl:otherwise>
        </xsl:choose>
    </xsl:template>

</xsl:transform>
