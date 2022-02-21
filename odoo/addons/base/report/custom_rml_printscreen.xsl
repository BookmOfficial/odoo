<?xml version = '1.0' encoding="utf-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:fo="http://www.w3.org/1999/XSL/Format">

	<xsl:template name="first_page_graphics_report"/>

	<xsl:template name="rml">
		<document filename="example.pdf">
			<template leftMargin="2.0cm" rightMargin="2.0cm" topMargin="2.0cm" bottomMargin="2.0cm" title="Report" allowSplitting="20">
				<pageTemplate id="first_page">
					<pageGraphics>
						<xsl:call-template name="first_page_graphics_corporation"/>
					</pageGraphics>

					<xsl:call-template name="first_page_frames"/>
				</pageTemplate>
			</template>

			<stylesheet>
			    <xsl:call-template name="stylesheet"/>
		    </stylesheet>

			<story>
				<xsl:call-template name="story"/>
			</story>

		</document>
    </xsl:template>
</xsl:stylesheet>
