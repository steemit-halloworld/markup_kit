<?xml version="1.0"?>

<!--
   Merging two XML files
   Version 1.6
   LGPL (c) Oliver Becker, 2002-07-05
   obecker@informatik.hu-berlin.de
-->

<xsl:transform version="1.0"
               xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
               xmlns:m="http://informatik.hu-berlin.de/merge"
               exclude-result-prefixes="m">

  <xsl:output method="xml" encoding="utf-8" indent="yes"/>

  <!-- Normalize the contents of text, comment, and processing-instruction
       nodes before comparing?
       Default: yes -->
  <xsl:param name="normalize" select="'yes'"/>

  <!-- Don't merge elements with this (qualified) name -->
  <xsl:param name="dontmerge"/>

  <!-- If set to true, text nodes in file1 will be replaced -->
  <xsl:param name="replace" select="true()"/>

  <!-- Variant 1: Source document looks like
       <?xml version="1.0"?>
       <merge xmlns="http://informatik.hu-berlin.de/merge">
          <file1>file1.xml</file1>
          <file2>file2.xml</file2>
       </merge>
       The transformation sheet merges file1.xml and file2.xml.
  -->
  <xsl:template match="m:merge">
    <xsl:variable name="file1" select="string(m:file1)"/>
    <xsl:variable name="file2" select="string(m:file2)"/>
    <!--xsl:message>
       <xsl:text />Merging '<xsl:value-of select="$file1" />
       <xsl:text />' and '<xsl:value-of select="$file2"/>'<xsl:text />
    </xsl:message-->
    <xsl:if test="$file1='' or $file2=''">
      <xsl:message terminate="yes">
        <xsl:text>No files to merge specified</xsl:text>
      </xsl:message>
    </xsl:if>
    <xsl:call-template name="m:merge">
      <xsl:with-param name="nodes1" select="document($file1,/*)/node()"/>
      <xsl:with-param name="nodes2" select="document($file2,/*)/node()"/>
    </xsl:call-template>
  </xsl:template>


  <!-- Variant 2:
       The transformation sheet merges the source document with the
       document provided by the parameter "with".
  -->
  <xsl:param name="with"/>

  <xsl:template match="*">
    <!--xsl:message>
       <xsl:text />Merging input with '<xsl:value-of select="$with"/>
       <xsl:text>'</xsl:text>
    </xsl:message-->
    <xsl:if test="string($with)=''">
      <xsl:message terminate="yes">
        <xsl:text>No input file specified (parameter 'with')</xsl:text>
      </xsl:message>
    </xsl:if>

    <xsl:call-template name="m:merge">
      <xsl:with-param name="nodes1" select="/node()"/>
      <xsl:with-param name="nodes2" select="document($with,/*)/node()"/>
    </xsl:call-template>
  </xsl:template>


  <!-- ============================================================== -->

  <!-- The "merge" template -->
  <xsl:template name="m:merge">
    <xsl:param name="nodes1"/>
    <xsl:param name="nodes2"/>

    <xsl:choose>
      <!-- Is $nodes1 resp. $nodes2 empty? -->
      <xsl:when test="count($nodes1)=0">
        <xsl:copy-of select="$nodes2"/>

      </xsl:when>
      <xsl:when test="count($nodes2)=0">
        <xsl:copy-of select="$nodes1"/>

      </xsl:when>

      <xsl:otherwise>
        <!-- Split $nodes1 and $nodes2 -->
        <xsl:variable name="first1" select="$nodes1[1]"/>
        <xsl:variable name="rest1" select="$nodes1[position()!=1]"/>
        <xsl:variable name="first2" select="$nodes2[1]"/>
        <xsl:variable name="rest2" select="$nodes2[position()!=1]"/>
        <!-- Determine type of node $first1 -->
        <xsl:variable name="type1">
          <xsl:apply-templates mode="m:detect-type" select="$first1"/>
        </xsl:variable>

        <!-- Compare $first1 and $first2 -->
        <xsl:variable name="diff-first">
          <xsl:call-template name="m:compare-nodes">
            <xsl:with-param name="node1" select="$first1"/>
            <xsl:with-param name="node2" select="$first2"/>
          </xsl:call-template>
        </xsl:variable>

        <xsl:choose>
          <!-- $first1 != $first2 -->
          <xsl:when test="$diff-first='!'">
            <!-- Compare $first1 and $rest2 -->
            <xsl:variable name="diff-rest">
              <xsl:for-each select="$rest2">
                <xsl:call-template name="m:compare-nodes">
                  <xsl:with-param name="node1" select="$first1"/>
                  <xsl:with-param name="node2" select="."/>
                </xsl:call-template>
              </xsl:for-each>
            </xsl:variable>

            <xsl:choose>
              <!-- $first1 is in $rest2 and
                   $first1 is *not* an empty text node  -->
              <xsl:when test="contains($diff-rest,'=') and
                                      not($type1='text' and
                                          normalize-space($first1)='')">
                <!-- determine position of $first1 in $nodes2
                     and copy all preceding nodes of $nodes2 -->
                <xsl:variable name="pos" select="string-length(substring-before($diff-rest,'=')) + 2"/>

                <xsl:copy-of select="$nodes2[position() &lt; $pos]"/>

                <!-- merge $first1 with its equivalent node -->
                <xsl:choose>
                  <!-- Elements: merge -->
                  <xsl:when test="$type1='element'">

                    <xsl:element name="{name($first1)}" namespace="{namespace-uri($first1)}">
                      <xsl:copy-of select="$first1/namespace::*"/>
                      <xsl:copy-of select="$first2/namespace::*"/>
                      <xsl:copy-of select="$first1/@*"/>

                      <xsl:call-template name="m:merge">
                        <xsl:with-param name="nodes1" select="$first1/node()"/>
                        <xsl:with-param name="nodes2" select="$nodes2[position()=$pos]/node()"/>
                      </xsl:call-template>
                    </xsl:element>

                  </xsl:when>
                  <!-- Other: copy -->
                  <xsl:otherwise>

                    <xsl:copy-of select="$first1"/>

                  </xsl:otherwise>
                </xsl:choose>

                <!-- Merge $rest1 and rest of $nodes2 -->
                <xsl:call-template name="m:merge">
                  <xsl:with-param name="nodes1" select="$rest1"/>
                  <xsl:with-param name="nodes2"
                                  select="$nodes2[position() &gt; $pos]"/>
                </xsl:call-template>
              </xsl:when>

              <!-- $first1 is a text node and replace mode was
                   activated -->
              <xsl:when test="$type1='text' and $replace">
                <xsl:call-template name="m:merge">
                  <xsl:with-param name="nodes1" select="$rest1"/>
                  <xsl:with-param name="nodes2" select="$nodes2"/>
                </xsl:call-template>
              </xsl:when>

              <!-- else: $first1 is not in $rest2 or
                   $first1 is an empty text node -->
              <xsl:otherwise>
                <xsl:copy-of select="$first1"/>
                <xsl:call-template name="m:merge">
                  <xsl:with-param name="nodes1" select="$rest1"/>
                  <xsl:with-param name="nodes2" select="$nodes2"/>
                </xsl:call-template>
              </xsl:otherwise>
            </xsl:choose>
          </xsl:when>

          <!-- else: $first1 = $first2 -->
          <xsl:otherwise>
            <xsl:choose>
              <!-- Elements: merge -->
              <xsl:when test="$type1='element'">

                <xsl:element name="{name($first1)}"
                             namespace="{namespace-uri($first1)}">
                  <xsl:copy-of select="$first1/namespace::*"/>
                  <xsl:copy-of select="$first2/namespace::*"/>
                  <!--xsl:copy-of select="$first1/@*" /-->

                  <xsl:call-template name="m:merge-attributes">
                    <xsl:with-param name="attrs1" select="$first1/@*"/>
                    <xsl:with-param name="attrs2" select="$first2/@*"/>
                  </xsl:call-template>

                  <xsl:call-template name="m:merge">
                    <xsl:with-param name="nodes1" select="$first1/node()"/>
                    <xsl:with-param name="nodes2" select="$first2/node()"/>
                  </xsl:call-template>
                </xsl:element>

              </xsl:when>
              <!-- Other: copy -->
              <xsl:otherwise>

                <xsl:copy-of select="$first1"/>

              </xsl:otherwise>
            </xsl:choose>

            <!-- Merge $rest1 and $rest2 -->
            <xsl:call-template name="m:merge">
              <xsl:with-param name="nodes1" select="$rest1"/>
              <xsl:with-param name="nodes2" select="$rest2"/>
            </xsl:call-template>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="m:merge-attributes">
    <xsl:param name="attrs1"/>
    <xsl:param name="attrs2"/>

    <xsl:copy-of select="$attrs1"/>

  </xsl:template>

  <!-- Comparing single nodes:
       if $node1 and $node2 are equivalent then the template creates a
       text node "=" otherwise a text node "!" -->
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
          <!-- same number ... -->
          <xsl:if test="count($node1/@*)!=count($node2/@*)">.</xsl:if>
          <!-- ... and same name/content -->
          <xsl:for-each select="$node1/@*">
            <xsl:if test="not($node2/@*
                        [local-name()=local-name(current()) and
                         namespace-uri()=namespace-uri(current()) and
                         .=current()])">.
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


  <!-- Type detection, thanks to M. H. Kay -->
  <xsl:template match="*" mode="m:detect-type">element</xsl:template>
  <xsl:template match="text()" mode="m:detect-type">text</xsl:template>
  <xsl:template match="comment()" mode="m:detect-type">comment</xsl:template>
  <xsl:template match="processing-instruction()" mode="m:detect-type">pi</xsl:template>

</xsl:transform>
